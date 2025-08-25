import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";


function App(){
  const {isLoading, isAuthenticated, user} = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if(isLoading) return
    if(!isAuthenticated){
      navigate("/login")
    }
    if(user && !user.organization){
      navigate("/create-org")
      return
    }
    navigate("/dashboard")
    
  }, [isLoading, isAuthenticated])
  return (
    <div className="min-h-screen"></div>
  )
}

export default App