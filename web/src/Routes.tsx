// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="Filieres" titleTo="filieres" buttonLabel="New Filiere" buttonTo="newFiliere">
        <Route path="/filieres/new" page={FiliereNewFilierePage} name="newFiliere" />
        <Route path="/filieres/{idF}/edit" page={FiliereEditFilierePage} name="editFiliere" />
        <Route path="/filieres/{idF}" page={FiliereFilierePage} name="filiere" />
        <Route path="/filieres" page={FiliereFilieresPage} name="filieres" />
      </Set>
      <Route path="/" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
