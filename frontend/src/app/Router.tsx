import { Route, Routes } from 'react-router-dom'

import { Main } from 'pages/Main'

interface RouteType {
  path: string
  component: JSX.Element
}

const testInstructions = [
  { line_number: 1, variable_changes: { a: 1 } },
  { line_number: 2, variable_changes: { b: 'hello world' } },
  { line_number: 1, variable_changes: { b: 'hello world2' } },
  { line_number: 2, variable_changes: { b: 'hello world3' } },
  { line_number: 1, variable_changes: { b: 'hello world4' } },
  { line_number: 2, variable_changes: { b: 'hello world5' } },
  { line_number: 1, variable_changes: { b: 'hello world6' } },
  { line_number: 2, variable_changes: { b: 'hello world7' } },
]

export const routes: RouteType[] = [
  {
    path: '/',
    component: <Main instructions={testInstructions} />,
  },
]

export const Router = () => {
  return (
    <Routes>
      {routes.map((r) => (
        <Route path={r.path} element={r.component} key={r.path} />
      ))}
    </Routes>
  )
}
