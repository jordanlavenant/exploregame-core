import { Link } from '@redwoodjs/router'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { useQuery } from '@apollo/client'

const QUERY = gql`
  query counts {
    questions {
      id
    }
    steps {
      id
    }
    scripts {
      id
    }
    departments {
      id
    }
  }
`


const NavBar = () => {
  const { data, loading, error } = useQuery(QUERY)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { questions, steps, scripts, departments } = data

  function deleteAllCookies() {
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    })
  }


  return (
    <nav className="bg-gray-900 p-4">
      <div className="grid grid-cols-3 items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Explore Game
        </Link>
        <div className="grid grid-cols-4 space-x-4 *:font-bold *:text-sm *:text-center *:text-white">
          <Link to="/departments">
            Filières ({departments?.length | 0})
          </Link>
          <Link to="/scripts">
            Scénarios ({scripts?.length  | 0})
          </Link>
          <Link to="/steps">
            Étapes ({steps?.length | 0})
          </Link>
          <Link to="/questions">
            Questions ({questions?.length | 0})
          </Link>
        </div>
        <div className='flex justify-end'>
          <Button
            variant='outline'
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