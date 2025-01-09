import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const NavigationItem = ({ title, children, ...props }) => {
  return (
    <li>
      <NavigationMenuLink
        {...props}
        className={cn(
          'block p-4 text-sm text-white rounded-md',
          'hover:bg-accent hover:text-accent-foreground',
          'transition-all duration-200',
          props.className
        )}
      >
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs">{children}</span>
      </NavigationMenuLink>
    </li>
  )
}

export default NavigationItem
