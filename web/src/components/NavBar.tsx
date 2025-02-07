import { useQuery } from '@apollo/client'
import { LogOut } from 'lucide-react'

import { Link } from '@redwoodjs/router'

import { Button } from './ui/button'

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
    bdes {
      id
    }
  }
`

const NavBar = () => {
  const { data, loading, error } = useQuery(QUERY)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { questions, scriptSteps, scripts, departments, bdes } = data

  return (
    <nav className="bg-gray-900 p-4">
      <div className="grid grid-cols-3 items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Explore Game
        </Link>
        <div className="flex justify-center gap-x-8 *:font-bold *:text-sm *:text-center *:text-white">
          <Link to="/departments">Départements ({departments?.length | 0})</Link>
          <Link to="/scripts">Scénarios ({scripts?.length | 0})</Link>
          <Link to="/script-steps">Étapes ({scriptSteps?.length | 0})</Link>
          <Link to="/questions">Questions ({questions?.length | 0})</Link>
          <Link to="/bdes">BDE ({bdes?.length | 0})</Link>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Add a confirmation dialog
            }}
          >
            <LogOut size={24} />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
