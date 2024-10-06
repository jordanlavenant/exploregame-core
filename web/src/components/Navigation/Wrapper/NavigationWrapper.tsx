import { LogOut } from 'lucide-react'

import NavigationItem from '../Item/NavigationItem'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const components = [
  {
    title: 'Filieres',
    href: '/courses',
    description: 'Liste des filieres',
  },
  {
    title: 'Scenarios',
    href: '/scripts',
    description: 'Liste des scénarios',
  },
  {
    title: 'Lieux',
    href: '/locations',
    description: 'Liste des lieux',
  },
  {
    title: 'Questions',
    href: '/questions',
    description: 'Liste des questions',
  },
  {
    title: 'Réponses',
    href: '/answers',
    description: 'Liste des réponses',
  },
  {
    title: 'Indices',
    route: '/hints',
    description: 'Liste des indices',
  },
]

const NavigationWrapper = () => {
  const { currentUser, logOut } = useAuth()
  if (!currentUser) return null

  return (
    <section className="rw-header items-center bg-background text-white">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="p-4">
              Assets
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-4">
              <ul className="grid w-[250px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[400px] ">
                {components.map((component) => (
                  <NavigationItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </NavigationItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <img src="/explore-game-logo.png" alt="logo" className="w-16" />
      <Button variant="outline" onClick={logOut} className="px-8 sm:px-4">
        <LogOut size={18} />
      </Button>
    </section>
  )
}

export default NavigationWrapper
