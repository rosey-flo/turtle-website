import { Navigate } from 'react-router-dom'

function Protect(props) {
    
    if(!props.loading) {
   
        if (props.requireAuth && !props.user) {
            return <Navigate to="/auth" />
        }

        if(props.requireAuth && props.user) {
            return props.children
        }
        
        if(!props.requireAuth && props.user) {
            return <Navigate to="/dashboard" />
        }

        if(!props.requireAuth && !props.user) {
            return props.children
        }
    }

    // return (
    //     <>
    //         {/* {props.requireAuth && !props.user ? <Navigate to="/auth" /> : props.children} */}

    //         {/* <Navigate to="/auth" /> */}
    //     </>
    // )
}

export default Protect