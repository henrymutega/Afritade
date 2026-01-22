import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import {forwardRef } from "react";

interface NavLinkComponentProps extends Omit<NavLinkProps, "className"> {
    className?: string;
    activeClassName?: string;
    PendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkComponentProps>(
    ( { className, activeClassName, PendingClassName, to, ...props }, ref ) => {
        return (
            <RouterNavLink
                ref={ref}
                to={to}
                className={({ isActive, isPending }) => 
                    cn(className, isActive && activeClassName, isPending && PendingClassName)
            }
                {...props}
            />
        );
    }
)
NavLink.displayName = "NavLink";

export { NavLink };