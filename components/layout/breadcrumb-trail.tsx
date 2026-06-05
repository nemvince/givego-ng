"use client";

import { useTranslations } from "next-intl";
import { type ComponentProps, Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

type BreadcrumbItemType = {
  href?: string;
  label: string;
  isTranslationKey?: boolean;
};

export function BreadcrumbTrail({
  items,
  ...props
}: {
  items: BreadcrumbItemType[];
} & ComponentProps<typeof Breadcrumb>) {
  const t = useTranslations();

  return (
    <Breadcrumb
      className={cn(
        props.className,
        "mx-auto w-full max-w-5xl px-4 pt-12 pb-2"
      )}
      {...props}
    >
      <BreadcrumbList>
        {items.map((item, i) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink render={<Link href={item.href} />}>
                  {item.isTranslationKey ? t(item.label) : item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>
                  {item.isTranslationKey ? t(item.label) : item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
