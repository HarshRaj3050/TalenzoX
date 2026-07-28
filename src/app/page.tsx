import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-dvh gap-5">
      <p>Landing page</p>
      <a href={`${siteConfig.url}/auth/login`} className="cursor-pointer">
        <Button>Login</Button>
      </a>
    </div>
  );
}
