"use client";

import * as React from "react";
import { Share2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import { siBluesky, siX } from "simple-icons";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px]",
  {
    variants: {
      size: {
        default: "h-10 min-w-[7.4rem] px-4 py-2",
        sm: "h-9 min-w-24 gap-1.5 rounded-md px-3",
        md: "h-10 min-w-[7.4rem] px-4 py-2",
        lg: "h-11 min-w-32 px-8",
      },
      icon: {
        suffix: "pl-4",
        prefix: "pr-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const iconSizeMap = {
  sm: 16,
  md: 20,
  lg: 28,
  default: 16,
};

type SharePlatform = "linkedin" | "x" | "bluesky";

export type ShareButtonProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
  className?: string;
  onIconClick?: (
    platform: SharePlatform,
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
} & VariantProps<typeof buttonVariants>;

function BlueskyIcon({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path d={siBluesky.path} />
    </svg>
  );
}

function XIcon({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path d={siX.path} />
    </svg>
  );
}

function LinkedInIcon({ size }: { size: number }) {
  return (
    <span
      aria-hidden="true"
      className="block"
      style={{
        width: size,
        height: size,
        backgroundColor: "currentColor",
        maskImage: "url('/LI-In-Bug-Black.png')",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskImage: "url('/LI-In-Bug-Black.png')",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

export function ShareButton({
  children,
  className,
  size,
  icon,
  onIconClick,
  ...props
}: ShareButtonProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.button
      className={cn(
        "bg-[color:var(--post-accent)] text-[color:var(--post-background)] hover:opacity-90",
        buttonVariants({ size, className, icon }),
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <AnimatePresence initial={false} mode="sync">
        {!hovered ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center gap-2"
          >
            {icon === "prefix" ? (
              <Share2
                className="size-4"
                size={iconSizeMap[size as keyof typeof iconSizeMap]}
              />
            ) : null}
            {children}
            {icon === "suffix" ? (
              <Share2
                className="size-4"
                size={iconSizeMap[size as keyof typeof iconSizeMap]}
              />
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="icons"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center gap-2"
          >
            <ShareIconGroup size={size} onIconClick={onIconClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

const shareIconGroupVariants = cva("flex items-center justify-center gap-3", {
  variants: {
    size: {
      default: "text-[16px]",
      sm: "text-[16px]",
      md: "text-[20px]",
      lg: "text-[28px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type ShareIconGroupProps = HTMLMotionProps<"div"> & {
  className?: string;
  onIconClick?: (
    platform: SharePlatform,
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
} & VariantProps<typeof shareIconGroupVariants>;

function ShareIconGroup({
  size = "default",
  className,
  onIconClick,
}: ShareIconGroupProps) {
  const iconSize = iconSizeMap[size as keyof typeof iconSizeMap];

  const handleIconClick = React.useCallback(
    (platform: SharePlatform, event: React.MouseEvent<HTMLDivElement>) => {
      onIconClick?.(platform, event);
    },
    [onIconClick],
  );

  return (
    <motion.div
      className={cn(shareIconGroupVariants({ size }), "group", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.5, type: "spring", bounce: 0.4 }}
        whileHover={{
          y: -8,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        className="box-border cursor-pointer rounded-lg py-3 group-hover:opacity-100"
        onClick={(event) => handleIconClick("x", event)}
      >
        <XIcon size={iconSize} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring", bounce: 0.4 }}
        whileHover={{
          y: -8,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        className="box-border cursor-pointer rounded-lg py-3 group-hover:opacity-100"
        onClick={(event) => handleIconClick("bluesky", event)}
      >
        <BlueskyIcon size={iconSize} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
        whileHover={{
          y: -8,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        className="box-border cursor-pointer rounded-lg py-3 group-hover:opacity-100"
        onClick={(event) => handleIconClick("linkedin", event)}
      >
        <LinkedInIcon size={iconSize} />
      </motion.div>
    </motion.div>
  );
}
