import {
  CSSProperties,
  ElementType,
  ReactNode,
  ComponentPropsWithoutRef,
} from "react";
import clsx from "clsx";

type BoundedProps<C extends ElementType> = {
  as?: C;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & ComponentPropsWithoutRef<C>;

export function Bounded<C extends ElementType = "section">({
  as: Comp = "section",
  className,
  children,
  ...restProps
}: BoundedProps<C>) {
  return (
    <Comp
      className={clsx(
        "px-6 ~py-10/16 [.header+&]:pt-44 [.header+&]:md:pt-32",
        className
      )}
      {...restProps}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </Comp>
  );
}
