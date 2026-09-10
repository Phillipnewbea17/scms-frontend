import { BrowserRouter, Routes, Route,Link } from "react-router-dom";

function home(){
    return(
        <h1>Welcome to the home page</h1>
    )
}

function apps(){
    return(
         <BrowserRouter>
         <nav>
            <Link to ='/home'>Home</Link>
             <Link to ='/counter'>Counter</Link>
              <Link to ='/form'>Form</Link>
            <Routes>
                <Route path='/home' element={<Home/>}/>
                <Route path='/counter' element={<Counter/>}/>
                <Route path='/form' element={<Form/>}/>
            </Routes>
         </nav>
         </BrowserRouter>
    )
}
export default app