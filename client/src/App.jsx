import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import Homepage from './pages/HomePage'
import Authform from './pages/AuthForm'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Protect from './components/Protect'

import { GET_USER } from './graphql/queries'

function App() {
  const [user, setUser] = useState(null)
  const {loading, data} = useQuery(GET_USER)
  //userQuery returns an object

  useEffect(() => {
    if(data) {
      setUser(data.getUser.user)
      //matches the query on get user from graphql to the resolver get user data
    }
  }, [data, user, loading])
  //runs it again so that on second round, which should now be truthy, will rnu the entire code

  return (
    <>
      {loading && (
        <div className="overlay row justify-center align-center">
          <h1>Loading...</h1>
        </div>)}

      <Header setUser={setUser} user={user}>
        <h3>Child Element</h3>
        </Header>

      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/auth" element={(
          <Protect require={false} user={data?.getUser.user} loading={loading}>
            <Authform setUser={setUser}/>
          </Protect>
        )}/>
        <Route path="/dashboard" element={(
          <Protect requireAuth={true} user={user} loading={loading}>
            <Dashboard user={user}/>
          </Protect>
        )}/>
      </Routes>
    </>
  )
}

export default App
