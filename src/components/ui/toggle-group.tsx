import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle-variants';

// Contexte pour partager les styles entre les composants
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
});

// Type pour les props communes à tous les composants ToggleGroup
type ToggleGroupBaseProps = {
  className?: string;
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
  children?: React.ReactNode;
};

// ToggleGroupSingle - pour le type "single"
type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const ToggleGroupSingle = React.forwardRef<HTMLDivElement, ToggleGroupSingleProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ variant, size }), [variant, size]);

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="single"
        className={cn('flex items-center justify-center gap-1', className)}
        {...props}
      >
        <ToggleGroupContext.Provider value={contextValue}>{children}</ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  }
);
ToggleGroupSingle.displayName = 'ToggleGroupSingle';

// ToggleGroupMultiple - pour le type "multiple"
type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

const ToggleGroupMultiple = React.forwardRef<HTMLDivElement, ToggleGroupMultipleProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ variant, size }), [variant, size]);

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="multiple"
        className={cn('flex items-center justify-center gap-1', className)}
        {...props}
      >
        <ToggleGroupContext.Provider value={contextValue}>{children}</ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  }
);
ToggleGroupMultiple.displayName = 'ToggleGroupMultiple';

// ToggleGroup - alias pour ToggleGroupSingle pour compatibilité avec le code existant
const ToggleGroup = ToggleGroupSingle;
ToggleGroup.displayName = 'ToggleGroup';

// ToggleGroupItem - élément individuel dans un groupe
type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants> & {
    value: string;
  };

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, variant, size, value, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        value={value}
        className={cn(
          toggleVariants({
            variant: context.variant ?? variant,
            size: context.size ?? size,
          }),
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );
  }
);
ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupSingle, ToggleGroupMultiple, ToggleGroupItem };
