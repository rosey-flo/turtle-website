import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { ADD_TURTLE, DELETE_TURTLE } from '../graphql/mutations'
import { GET_USER_TURTLE, GET_ALL_TURTLES } from '../graphql/queries'


const initialFormData = {
    name: '',
    weapon: '',
    headbandColor: ''
}


function Dashboard() {
    const [formData, setFormData] = useState(initialFormData)
    const [addTurtle] = useMutation(ADD_TURTLE, {
        variables: formData,
        refetchQueries: [GET_USER_TURTLE, GET_ALL_TURTLES]
    })
    const [deleteTurtle] = useMutation(DELETE_TURTLE, {
        refetchQueries: [GET_USER_TURTLE, GET_ALL_TURTLES]
    })
    const { data: turtleData } = useQuery(GET_USER_TURTLE) //alias's data as turtleData for better understanding


    const handleInputChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

       try {
        const res = await addTurtle()
       }
       catch (error) {
        console.log(error)
       }

        
        setFormData({
            ...initialFormData
        })
    }

    const handleDeleteTurtle = async (id) => {
       
        await deleteTurtle({
            variables: {
                turtle_id: id
            }
        })
    }

    return (
        <>

            <form className="column" onSubmit={handleSubmit}>
                <h2 className="text-center">Add a NinjaTurtle</h2>

                <input type="text" onChange={handleInputChange} value={formData.name} name="name" placeholder="Enter the Turtle's Name (Must be a renaissance artist)" />
                <input type="text" onChange={handleInputChange} value={formData.weapon} name="weapon" placeholder="Enter the Turtle's Weapon" />
                <input type="text" onChange={handleInputChange} value={formData.headbandColor} name="headbandColor" placeholder="Enter the Turtle's headband color" />

                <button>Add</button>
            </form>

            <section className='turtle-container'>
                <h1>Your Turtles:</h1>

                {/* {turtleData?.getAllTurtles.length && <h2>No Turtles have been added</h2>} */}

                <div className='turtle-output'>
                    {turtleData?.getUserTurtle.map(turtleObj => (
                        <article key={turtleObj._id}>
                            <h3>{turtleObj.name}</h3>
                            <p>Weapon: {turtleObj.weapon}</p>
                            <p>Headband: {turtleObj.headbandColor}</p>
                            <button onClick={() => {handleDeleteTurtle(turtleObj.id)}}>Delete</button>
                        </article>
                        ))}
                </div>
            </section>
        </>
    )
}

export default Dashboard