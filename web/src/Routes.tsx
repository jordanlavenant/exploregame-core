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
      <PrivateSet unauthenticated="login">
        <Route path="/" page={HomePage} name="home" />
        <Set wrap={ScaffoldLayout} title="Tags" titleTo="tags" buttonLabel="New Tag" buttonTo="newTag">
          <Route path="/tags/new" page={TagNewTagPage} name="newTag" />
          <Route path="/tags/{id}/edit" page={TagEditTagPage} name="editTag" />
          <Route path="/tags/{id}" page={TagTagPage} name="tag" />
          <Route path="/tags" page={TagTagsPage} name="tags" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Newses" titleTo="newses" buttonLabel="New News" buttonTo="newNews">
          <Route path="/newses/new" page={NewsNewNewsPage} name="newNews" />
          <Route path="/newses/{id}/edit" page={NewsEditNewsPage} name="editNews" />
          <Route path="/newses/{id}" page={NewsNewsPage} name="news" />
          <Route path="/newses" page={NewsNewsesPage} name="newses" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Bdes" titleTo="bdes" buttonLabel="New Bde" buttonTo="newBde">
          <Route path="/bdes/new" page={BdeNewBdePage} name="newBde" />
          <Route path="/bdes/{id}/edit" page={BdeEditBdePage} name="editBde" />
          <Route path="/bdes/{id}" page={BdeBdePage} name="bde" />
          <Route path="/bdes" page={BdeBdesPage} name="bdes" />
        </Set>
        <Set wrap={ScaffoldLayout}>
          <Route path="/departments/new" page={DepartmentNewDepartmentPage} name="newDepartment" />
          <Route path="/departments/{id}/edit" page={DepartmentEditDepartmentPage} name="editDepartment" />
          <Route path="/departments" page={DepartmentDepartmentsPage} name="departments" />
        </Set>
        <Set wrap={ScaffoldLayout}>
          <Route path="/scripts/new" page={ScriptNewScriptPage} name="newScript" />
          <Route path="/scripts/{id}/edit" page={ScriptEditScriptPage} name="editScript" />
          <Route path="/scripts" page={ScriptScriptsPage} name="scripts" />
        </Set>
        <Set wrap={ScaffoldLayout} title="HintLevels" titleTo="hintLevels" buttonLabel="New HintLevel" buttonTo="newHintLevel">
          <Route path="/hint-levels/new" page={HintLevelNewHintLevelPage} name="newHintLevel" />
          <Route path="/hint-levels/{id}/edit" page={HintLevelEditHintLevelPage} name="editHintLevel" />
          <Route path="/hint-levels/{id}" page={HintLevelHintLevelPage} name="hintLevel" />
          <Route path="/hint-levels" page={HintLevelHintLevelsPage} name="hintLevels" />
        </Set>
        <Set wrap={ScaffoldLayout} title="QuestionTypes" titleTo="questionTypes" buttonLabel="New QuestionType" buttonTo="newQuestionType">
          <Route path="/question-types/new" page={QuestionTypeNewQuestionTypePage} name="newQuestionType" />
          <Route path="/question-types/{id}/edit" page={QuestionTypeEditQuestionTypePage} name="editQuestionType" />
          <Route path="/question-types/{id}" page={QuestionTypeQuestionTypePage} name="questionType" />
          <Route path="/question-types" page={QuestionTypeQuestionTypesPage} name="questionTypes" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Locations" titleTo="locations" buttonLabel="New Location" buttonTo="newLocation">
          <Route path="/locations/new" page={LocationNewLocationPage} name="newLocation" />
          <Route path="/locations/{id}/edit" page={LocationEditLocationPage} name="editLocation" />
          <Route path="/locations/{id}" page={LocationLocationPage} name="location" />
          <Route path="/locations" page={LocationLocationsPage} name="locations" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
          <Route path="/users/new" page={UserNewUserPage} name="newUser" />
          <Route path="/users/{id}/edit" page={UserEditUserPage} name="editUser" />
          <Route path="/users/{id}" page={UserUserPage} name="user" />
          <Route path="/users" page={UserUsersPage} name="users" />
        </Set>
        <Set wrap={ScaffoldLayout}>
          <Route path="/questions/new" page={QuestionNewQuestionPage} name="newQuestion" />
          <Route path="/questions/{id}/edit" page={QuestionEditQuestionPage} name="editQuestion" />
          <Route path="/questions" page={QuestionQuestionsPage} name="questions" />
        </Set>
        <Set wrap={ScaffoldLayout}>
          <Route path="/script-steps/new" page={ScriptStepNewScriptStepPage} name="newScriptStep" />
          <Route path="/script-steps/{id}/edit" page={ScriptStepEditScriptStepPage} name="editScriptStep" />
          <Route path="/script-steps" page={ScriptStepScriptStepsPage} name="scriptSteps" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Players" titleTo="players" buttonLabel="New Player" buttonTo="newPlayer">
          <Route path="/players/new" page={PlayerNewPlayerPage} name="newPlayer" />
          <Route path="/players/{id}/edit" page={PlayerEditPlayerPage} name="editPlayer" />
          <Route path="/players/{id}" page={PlayerPlayerPage} name="player" />
          <Route path="/players" page={PlayerPlayersPage} name="players" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Hints" titleTo="hints" buttonLabel="New Hint" buttonTo="newHint">
          <Route path="/hints/new" page={HintNewHintPage} name="newHint" />
          <Route path="/hints/{id}/edit" page={HintEditHintPage} name="editHint" />
          <Route path="/hints/{id}" page={HintHintPage} name="hint" />
          <Route path="/hints" page={HintHintsPage} name="hints" />
        </Set>
        <Set wrap={ScaffoldLayout} title="PlayerScripts" titleTo="playerScripts" buttonLabel="New PlayerScript" buttonTo="newPlayerScript">
          <Route path="/player-scripts/new" page={PlayerScriptNewPlayerScriptPage} name="newPlayerScript" />
          <Route path="/player-scripts/{id}/edit" page={PlayerScriptEditPlayerScriptPage} name="editPlayerScript" />
          <Route path="/player-scripts/{id}" page={PlayerScriptPlayerScriptPage} name="playerScript" />
          <Route path="/player-scripts" page={PlayerScriptPlayerScriptsPage} name="playerScripts" />
        </Set>
        <Set wrap={ScaffoldLayout} title="CharacterSteps" titleTo="characterSteps" buttonLabel="New CharacterStep" buttonTo="newCharacterStep">
          <Route path="/character-steps/new" page={CharacterStepNewCharacterStepPage} name="newCharacterStep" />
          <Route path="/character-steps/{id}/edit" page={CharacterStepEditCharacterStepPage} name="editCharacterStep" />
          <Route path="/character-steps/{id}" page={CharacterStepCharacterStepPage} name="characterStep" />
          <Route path="/character-steps" page={CharacterStepCharacterStepsPage} name="characterSteps" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Étapes" titleTo="steps" buttonLabel="Nouvelle étape" buttonTo="newStep">
          <Route path="/steps/new" page={StepNewStepPage} name="newStep" />
          <Route path="/steps/{id}/edit" page={StepEditStepPage} name="editStep" />
          <Route path="/steps/{id}" page={StepStepPage} name="step" />
          <Route path="/steps" page={StepStepsPage} name="steps" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Characters" titleTo="characters" buttonLabel="New Character" buttonTo="newCharacter">
          <Route path="/characters/new" page={CharacterNewCharacterPage} name="newCharacter" />
          <Route path="/characters/{id}/edit" page={CharacterEditCharacterPage} name="editCharacter" />
          <Route path="/characters/{id}" page={CharacterCharacterPage} name="character" />
          <Route path="/characters" page={CharacterCharactersPage} name="characters" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Answers" titleTo="answers" buttonLabel="New Answer" buttonTo="newAnswer">
          <Route path="/answers/new" page={AnswerNewAnswerPage} name="newAnswer" />
          <Route path="/answers/{id}/edit" page={AnswerEditAnswerPage} name="editAnswer" />
          <Route path="/answers/{id}" page={AnswerAnswerPage} name="answer" />
          <Route path="/answers" page={AnswerAnswersPage} name="answers" />
        </Set>
        <Set wrap={ScaffoldLayout} title="ColorSets" titleTo="colorSets" buttonLabel="New ColorSet" buttonTo="newColorSet">
          <Route path="/color-sets/new" page={ColorSetNewColorSetPage} name="newColorSet" />
          <Route path="/color-sets/{id}/edit" page={ColorSetEditColorSetPage} name="editColorSet" />
          <Route path="/color-sets/{id}" page={ColorSetColorSetPage} name="colorSet" />
          <Route path="/color-sets" page={ColorSetColorSetsPage} name="colorSets" />
        </Set>
      </PrivateSet>
      <Route path="/login" page={LoginPage} name="login" />
      {/* <Route path="/signup" page={SignupPage} name="signup" /> */}
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
