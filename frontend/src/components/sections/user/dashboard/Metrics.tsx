import { DashboardSectionHeader } from "@/components/reusable/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderContext } from "@/context/order.context";
import { useProductContext } from "@/context/product.context";
import { animations } from "@/utils/animations/animations";
import { useGSAP } from "@gsap/react";
import {
  BarChart4,
  CheckCircle,
  Clock,
  GaugeCircle,
  Heart,
  ShoppingBag,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import CountUp from "react-countup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWishlistContext } from "@/context/wishlist.context";
import { useCartContext } from "@/context/cart.context";
gsap.registerPlugin(ScrollTrigger);

const Metrics = () => {
  const { pendingOrders, confirmedOrders, cancelledOrders, ordersCount } =
    useOrderContext();
  const { wishlist } = useWishlistContext();
  const { cartProductsCount } = useCartContext()
  const [countUpStarted, setCountUpStarted] = useState(false);

  const metrics = [
    {
      label: "Total Orders",
      value: ordersCount,
      icon: <ShoppingBag className="h-6 w-6" />,
      bg: "from-cyan-400 to-cyan-600 dark:from-orange-500 dark:to-red-500",
      shadow: "shadow-cyan-500/50 dark:shadow-orange-500/50",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: <Clock className="h-6 w-6" />,
      bg: "from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500",
      shadow: "shadow-orange-400/50 dark:shadow-yellow-400/50",
    },
    {
      label: "Confirmed Orders",
      value: confirmedOrders.length,
      icon: <CheckCircle className="h-6 w-6" />,
      bg: "from-green-400 to-emerald-400 dark:from-green-500 dark:to-emerald-500",
      shadow: "shadow-green-500/50 dark:shadow-emerald-500/50",
    },
    {
      label: "Cancelled Orders",
      value: cancelledOrders.length,
      icon: <XCircle className="h-6 w-6" />,
      bg: "from-gray-400 to-zinc-400 dark:from-gray-500 dark:to-zinc-700",
      shadow: "shadow-zinc-500/40 dark:shadow-zinc-700/50",
    },
    {
      label: "Wishlist Items",
      value: wishlist.length,
      icon: <Heart className="h-6 w-6" />,
      bg: "from-pink-400 to-red-400 dark:from-pink-500 dark:to-red-500",
      shadow: "shadow-pink-400/50 dark:shadow-red-500/50",
    },
    {
      label: "Cart Products",
      value: cartProductsCount,
      icon: <ShoppingCart className="h-6 w-6" />,
      bg: "from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500",
      shadow: "shadow-indigo-400/50 dark:shadow-indigo-500/50",
    },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".metrics-section",
        start: "top 85%",
        end: "bottom 10%",
        toggleActions: "play reverse play reverse",
      },
      defaults: { duration: 2 },
    });

    tl.fromTo(".metrics-header", animations.dashboardSectionHeader.from, {
      ...animations.dashboardSectionHeader.to,
      delay: 2.8,
    }).fromTo(
      ".metric-card",
      animations.metricsCards.from,
      {
        ...animations.metricsCards.to,
        onComplete: () => {
          if (!countUpStarted) setCountUpStarted(true);
        },
      },
      "<0.3",
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="metrics-section space-y-6">
      <DashboardSectionHeader
        mainIcon={<GaugeCircle className="size-8 stroke-[3.5]" />}
        mainHeading="Your Activity Snapshot"
        subIcon={<BarChart4 className="size-5" />}
        subText={"Overview of your latest orders, wishlist, and cart."}
        animateClassName="metrics-header"
      />

      <div className="xsm:grid-cols-2 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {metrics.map(({ label, icon, bg, value, shadow }, i) => (
          <Card
            key={i}
            className={`metric-card border-none text-white shadow-lg ${shadow} bg-gradient-to-r ${bg}`}
          >
            <CardHeader className="flex flex-row items-center gap-x-4">
              <CardTitle>{icon}</CardTitle>
              <CardTitle className="text-xl font-semibold">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-right">
              {countUpStarted ? (
                <CountUp
                  end={value}
                  className="text-3xl font-bold"
                  duration={0.5}
                  separator=","
                  easingFn={animations.countUpEase}
                />
              ) : (
                <span className="text-3xl font-bold">0</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
