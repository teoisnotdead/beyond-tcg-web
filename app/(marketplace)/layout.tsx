import { MarketplaceNavbar } from "@/components/layout/marketplace-navbar";
import { MarketplaceFooter } from "@/components/layout/marketplace-footer";

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="
                flex min-h-screen flex-col bg-transparent
                bg-[linear-gradient(135deg,_rgba(245,245,247,0.9)_0%,_rgba(240,242,245,0.9)_45%,_rgba(235,238,243,0.9)_100%)]
                dark:bg-[linear-gradient(135deg,_rgba(8,10,16,0.96)_0%,_rgba(7,9,14,0.94)_45%,_rgba(10,8,16,0.92)_100%)]
            "
        >
            <MarketplaceNavbar />
            <main className="flex-1">{children}</main>
            <MarketplaceFooter />
        </div>
    );
}
