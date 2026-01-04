import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/auth.context";
import { newsLetterSchema } from "@/schemas/news-letterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const RenderFooterLinks = ({
  heading,
  links,
}: {
  heading: string;
  links: any[];
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-950 dark:text-white">
          {heading}
        </h2>
      </div>
      <div className="flex flex-col gap-y-2 text-sm text-gray-900 dark:text-gray-300">
        {links.map(({ name, link }, i) => (
          <Link key={i} to={link}>
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};

const FooterTop = () => {
  const { user } = useAuthContext();

  const form = useForm({
    resolver: zodResolver(newsLetterSchema),
    defaultValues: {
      "news-letter": "",
    },
  });

  const accountLinks = [
    !user && { name: "Login", link: "/sign-in" },
    !user && { name: "Sign Up", link: "/sign-up" },
    { name: "My Account", link: "/me" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Cart", link: "/cart" },
    { name: "Wishlist", link: "/wishlist" },
    { name: "Track Your Order", link: "/track-order" },
  ].filter(Boolean);

  const quickLinks = [
    { name: "Products", link: "/products" },
    { name: "FAQS", link: "/faqs" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
    { name: "Privacy Policy", link: "/privacy-policy" },
  ];

  const onSubmit = (data: z.infer<typeof newsLetterSchema>) => {
    console.log(data);
  };

  return (
    <section
      className="flex w-full flex-col flex-wrap gap-10 sm:flex-row sm:justify-between"
      aria-labelledby="footer-main"
    >
      {/* === Newsletter Subscription === */}
      <div
        className="flex flex-col gap-y-4"
        aria-labelledby="newsletter-heading"
      >
        <div className="space-y-1">
          <h2
            id="newsletter-heading"
            className="text-xl font-semibold text-gray-950 dark:text-white"
          >
            Newsletter
          </h2>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-sm text-gray-900 dark:text-gray-300">
            Subscribe for updates, offers & product tips.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="z-50">
              <div className="relative">
                <FormField
                  name="news-letter"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          aria-label="Enter your email for newsletter"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  variant={"ghost"}
                  className="absolute top-5.5 -right-0.5 size-9 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
                >
                  <SendHorizonalIcon className="size-5.5" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* === Support Info === */}
      <div className="flex flex-col gap-y-4" aria-labelledby="support-heading">
        <div className="space-y-1">
          <h2
            id="support-heading"
            className="text-xl font-semibold text-gray-950 dark:text-white"
          >
            Support
          </h2>
        </div>
        <div className="flex flex-col gap-y-2 text-sm text-gray-900 dark:text-gray-300">
          <a
            href="mailto:shopnex.support@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email ShopNex Support"
          >
            shopnex.support@gmail.com
          </a>
          <Link to="/support" aria-label="Visit help and support page">
            Help & Support
          </Link>
        </div>
      </div>

      {/* === Account Links === */}
      <RenderFooterLinks heading="Account" links={accountLinks} />

      {/* === Quick Links === */}
      <RenderFooterLinks heading="Quick Links" links={quickLinks} />
    </section>
  );
};

export default FooterTop;
