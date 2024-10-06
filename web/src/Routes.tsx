// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, PrivateSet } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <PrivateSet unauthenticated="login">
        <Route path="/" page={HomePage} name="home" />
        <Set wrap={ScaffoldLayout} title="Statuses" titleTo="statuses" buttonLabel="New Status" buttonTo="newStatus">
          <Route path="/statuses/new" page={StatusNewStatusPage} name="newStatus" />
          <Route path="/statuses/{id}/edit" page={StatusEditStatusPage} name="editStatus" />
          <Route path="/statuses/{id}" page={StatusStatusPage} name="status" />
          <Route path="/statuses" page={StatusStatusesPage} name="statuses" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Admins" titleTo="admins" buttonLabel="New Admin" buttonTo="newAdmin">
          <Route path="/admins/new" page={AdminNewAdminPage} name="newAdmin" />
          <Route path="/admins/{id}/edit" page={AdminEditAdminPage} name="editAdmin" />
          <Route path="/admins/{id}" page={AdminAdminPage} name="admin" />
          <Route path="/admins" page={AdminAdminsPage} name="admins" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Players" titleTo="players" buttonLabel="New Player" buttonTo="newPlayer">
          <Route path="/players/new" page={PlayerNewPlayerPage} name="newPlayer" />
          <Route path="/players/{id}/edit" page={PlayerEditPlayerPage} name="editPlayer" />
          <Route path="/players/{id}" page={PlayerPlayerPage} name="player" />
          <Route path="/players" page={PlayerPlayersPage} name="players" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
          <Route path="/users/new" page={UserNewUserPage} name="newUser" />
          <Route path="/users/{id}/edit" page={UserEditUserPage} name="editUser" />
          <Route path="/users/{id}" page={UserUserPage} name="user" />
          <Route path="/users" page={UserUsersPage} name="users" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Scénarios" titleTo="scripts" buttonLabel="Nouveau scénario" buttonTo="newScript">
          <Route path="/scripts/new" page={ScriptNewScriptPage} name="newScript" />
          <Route path="/scripts/{id}/edit" page={ScriptEditScriptPage} name="editScript" />
          <Route path="/scripts/{id}" page={ScriptScriptPage} name="script" />
          <Route path="/scripts" page={ScriptScriptsPage} name="scripts" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Indices" titleTo="hints" buttonLabel="Nouvel indice" buttonTo="newHint">
          <Route path="/hints/new" page={HintNewHintPage} name="newHint" />
          <Route path="/hints/{id}/edit" page={HintEditHintPage} name="editHint" />
          <Route path="/hints/{id}" page={HintHintPage} name="hint" />
          <Route path="/hints" page={HintHintsPage} name="hints" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Réponses" titleTo="answers" buttonLabel="Nouvelle réponse" buttonTo="newAnswer">
          <Route path="/answers/new" page={AnswerNewAnswerPage} name="newAnswer" />
          <Route path="/answers/{id}/edit" page={AnswerEditAnswerPage} name="editAnswer" />
          <Route path="/answers/{id}" page={AnswerAnswerPage} name="answer" />
          <Route path="/answers" page={AnswerAnswersPage} name="answers" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Questions" titleTo="questions" buttonLabel="Nouvelle question" buttonTo="newQuestion">
          <Route path="/questions/new" page={QuestionNewQuestionPage} name="newQuestion" />
          <Route path="/questions/{id}/edit" page={QuestionEditQuestionPage} name="editQuestion" />
          <Route path="/questions/{id}" page={QuestionQuestionPage} name="question" />
          <Route path="/questions" page={QuestionQuestionsPage} name="questions" />
        </Set>
        <Set wrap={ScaffoldLayout} title="QuestionTypes" titleTo="questionTypes" buttonLabel="New QuestionType" buttonTo="newQuestionType">
          <Route path="/question-types/new" page={QuestionTypeNewQuestionTypePage} name="newQuestionType" />
          <Route path="/question-types/{id}/edit" page={QuestionTypeEditQuestionTypePage} name="editQuestionType" />
          <Route path="/question-types/{id}" page={QuestionTypeQuestionTypePage} name="questionType" />
          <Route path="/question-types" page={QuestionTypeQuestionTypesPage} name="questionTypes" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Filières" titleTo="courses" buttonLabel="Nouvelle filière" buttonTo="newCourse">
          <Route path="/courses/new" page={CourseNewCoursePage} name="newCourse" />
          <Route path="/courses/{id}/edit" page={CourseEditCoursePage} name="editCourse" />
          <Route path="/courses/{id}" page={CourseCoursePage} name="course" />
          <Route path="/courses" page={CourseCoursesPage} name="courses" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Lieux" titleTo="locations" buttonLabel="Nouveau lieu" buttonTo="newLocation">
          <Route path="/locations/new" page={LocationNewLocationPage} name="newLocation" />
          <Route path="/locations/{id}/edit" page={LocationEditLocationPage} name="editLocation" />
          <Route path="/locations/{id}" page={LocationLocationPage} name="location" />
          <Route path="/locations" page={LocationLocationsPage} name="locations" />
        </Set>
      </PrivateSet>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
