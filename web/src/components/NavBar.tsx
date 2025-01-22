import { Link } from '@redwoodjs/router'

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Home
        </Link>
        <div className="flex space-x-4">
          <Link to="/departments" className="text-white">
            Departments
          </Link>
          <Link to="/scripts" className="text-white">
            Scenarios
          </Link>
          <Link to="/steps" className="text-white">
            Etapes
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar