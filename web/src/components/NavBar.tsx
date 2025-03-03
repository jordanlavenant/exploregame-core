import { useEffect, useState } from 'react'

import { useQuery } from '@apollo/client'
import {
  BookOpen,
  LogOut,
  Map,
  Menu,
  Milestone,
  HelpCircle,
  Home,
  Building2,
  User,
  Moon,
  Sun,
  Activity,
} from 'lucide-react'

import { Link, navigate, routes, useLocation } from '@redwoodjs/router'

import { useTheme } from './theme-provider'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

import { useAuth } from '@/auth'
import { cn } from '@/lib/utils'

const QUERY = gql`
  query counts {
    questions {
      id
    }
    scriptSteps {
      id
    }
    scripts {
      id
    }
    departments {
      id
    }
    users {
      id
      email
    }
  }
`

const NavBar = () => {
  const { logOut, currentUser } = useAuth()
  const { data, loading } = useQuery(QUERY)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  // Détection de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    logOut().then(() => navigate('/login'))
  }

  const userEmail: string = currentUser?.email as string

  // Initiales de l'utilisateur pour l'avatar
  const getUserInitials = () => {
    if (!userEmail) return <User className="size-5" />
    return userEmail
      .split('@')[0]
      .split('.')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const navItems = [
    {
      to: routes.home(),
      label: 'Accueil',
      icon: <Home className="h-5 w-5" />,
      mobileLabel: 'Accueil',
    },
    {
      to: routes.departments(),
      label: 'Filières',
      icon: <Building2 className="h-5 w-5" />,
      count: data?.departments?.length || 0,
      mobileLabel: 'Filières',
    },
    {
      to: routes.scripts(),
      label: 'Scénarios',
      icon: <BookOpen className="h-5 w-5" />,
      count: data?.scripts?.length || 0,
      mobileLabel: 'Scénarios',
    },
    {
      to: routes.scriptSteps(),
      label: 'Étapes',
      icon: <Milestone className="h-5 w-5" />,
      count: data?.scriptSteps?.length || 0,
      mobileLabel: 'Étapes',
    },
    {
      to: routes.questions(),
      label: 'Questions',
      icon: <HelpCircle className="h-5 w-5" />,
      count: data?.questions?.length || 0,
      mobileLabel: 'Questions',
    },
  ]

  const NavLink = ({
    to,
    label,
    icon,
    count = 0,
    className = '',
    onClick = () => {},
  }) => {
    const isActive =
      location.pathname === to || location.pathname.startsWith(`${to}/`)

    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          'group relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          isActive
            ? 'text-primary bg-primary/10'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'transition-transform duration-200',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'
            )}
          >
            {icon}
          </div>
          <span>{label}</span>
          {count > 0 && (
            <Badge
              variant={isActive ? 'default' : 'outline'}
              className={cn(
                'ml-auto transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'group-hover:bg-primary group-hover:text-primary-foreground'
              )}
            >
              {count}
            </Badge>
          )}
        </div>

        {/* Indicateur actif animé */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-primary rounded-r-full animate-pulse" />
        )}
      </Link>
    )
  }

  const MobileNavLink = ({
    to,
    mobileLabel,
    icon,
    count = 0,
    onClick = () => {},
  }) => {
    const isActive =
      location.pathname === to || location.pathname.startsWith(`${to}/`)

    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          'flex items-center justify-between px-3 py-3 rounded-md transition-all duration-200',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground hover:bg-accent'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'transition-all duration-300',
              isActive && 'text-primary'
            )}
          >
            {icon}
          </div>
          <span className="font-medium">{mobileLabel}</span>
        </div>
        {count > 0 && (
          <Badge variant={isActive ? 'default' : 'outline'}>{count}</Badge>
        )}
      </Link>
    )
  }

  if (loading)
    return (
      <div className="bg-background/80 backdrop-blur-sm border-b h-16 flex items-center px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b border-dashed',
        scrolled
          ? 'bg-background/85 backdrop-blur-lg shadow-sm'
          : 'bg-background/50 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo avec animation au hover */}
          <Link
            to={routes.home()}
            className="group font-bold text-xl flex items-center gap-3"
          >
            <div className="relative overflow-hidden">
              <Map className="h-7 w-7 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg] group-hover:text-primary" />
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </div>
            <span className="hidden sm:inline-block relative overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:text-primary">
                Explore Game
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </Link>

          {/* Desktop Navigation - Grande taille */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
          </nav>

          {/* Desktop Navigation - Moyenne taille (icônes uniquement) */}
          <nav className="hidden md:flex lg:hidden items-center justify-center space-x-1">
            {navItems.map((item) => (
              <TooltipProvider key={item.to} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.to}
                      className={cn(
                        'p-2.5 rounded-lg transition-all duration-200 flex flex-col items-center justify-center',
                        location.pathname === item.to
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      {item.icon}
                      {item.count > 0 && (
                        <Badge
                          variant="default"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                        >
                          {item.count}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>
                      {item.label} {item.count > 0 ? `(${item.count})` : ''}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mode sombre/clair */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full hover:bg-accent"
              aria-label="Changer de thème"
            >
              <Sun className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Changer de thème</span>
            </Button>

            {/* Menu utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      Administrateur
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button avec badge d'alerte */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden relative"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                  {/* Badge de notification conditionnel */}
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary"></span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <SheetHeader className="flex-none">
                  <SheetTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    <span>Explore Game</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex-grow flex flex-col gap-2 my-6 overflow-auto">
                  {navItems.map((item) => (
                    <MobileNavLink
                      key={item.to}
                      {...item}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </nav>

                <SheetFooter className="flex-none border-t pt-4">
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[180px]">
                          {userEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Administrateur
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                      }
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    variant="destructive"
                    className="w-full my-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
