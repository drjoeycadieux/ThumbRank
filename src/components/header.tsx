"use client";

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/pricing', label: 'Pricing' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="font-bold">ThumbRank</span>
                </Link>
                <nav className="flex items-center gap-6 text-sm">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === item.href ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                 <div className="flex flex-1 items-center justify-end gap-2">
                    <Button variant="ghost">Sign In</Button>
                    <Button>Sign Up</Button>
                </div>
            </div>
        </header>
    );
}
