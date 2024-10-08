import { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations'



const initialFormData = {
    username: '',
    email: '',
    password: '',
    isLogin: true
}




function AuthForm(props) {
    const [formData, setFormData] = useState(initialFormData)

    //LOGIN AND REGISTER
    const [loginUser] = useMutation(LOGIN_USER, {
        variables: formData
    })
    const [registerUser] = useMutation(REGISTER_USER, {
        variables: formData
    })

    const navigate = useNavigate()

    const toggleAuthState = (newValue) => {
        setFormData({
            ...formData,
            errorMessage: '',
            isLogin: newValue

        })
    }

    const handleInputChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            let res; //dynamic to handle if it is either login or register

            if (formData.isLogin) {
                res = await loginUser()
                props.setUser(res.data.loginUser.user)
            } else {
                res = await registerUser()
                props.setUser(res.data.registerUser.user)
            }


            navigate('/dashboard') //will navigate logged in user/newly made user to their respective dashboard

        } catch (error) {
            setFormData({
                ...formData,
                errorMessage: error.message
            })
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit} className="column">

                <h2 className="text-center">{formData.isLogin ? 'Log In' : 'Register'}</h2>

                {formData.errorMessage && <p className="error-message text-center">{formData.errorMessage}</p>}

                {!formData.isLogin && <input onChange={handleInputChange} name="username" type="text" placeholder="Enter your username" />}

                <input onChange={handleInputChange} name="email" type="email" placeholder="Enter your email address" autoComplete="email" />

                <input onChange={handleInputChange} name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />

                <button>Submit</button>

                {formData.isLogin ? (
                    <p className='text-center'>Need an Account? <span onClick={() => toggleAuthState(false)}>Click Here</span></p>
                ) : (
                    <p className='text-center'>Already registered? <span onClick={() => toggleAuthState(true)}>Click Here</span></p>)}
            </form>
        </>

    )
}

export default AuthForm