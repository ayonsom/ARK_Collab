import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Modal from './Modal'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationButtons, setPaginationButtons] = useState([])
  const [users, setUsers] = useState([])
  const [seletedUser, setSelectedUser] = useState("")
  const [allPosts, setAllPosts] = useState([])
  const [displayPopUp, setDisplayPopUp] = useState(null)


  const onClose=()=>setDisplayPopUp(false)
  const postsPerPage = 10;

  const fetchUsers = async () =>{
    try {
      const response_users = await fetch('https://jsonplaceholder.typicode.com/users')
      if(!response_users.ok){throw new Error("Fetching users failed..!");}
      const data_users = await response_users.json()
      setUsers(data_users);
      // console.log(data_users);
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    setDisplayPopUp(true)
    fetchPosts(1)
    fetchUsers()    
  }, []);

  const fetchPosts = async(page=1)=>{
    setLoading(true);
    setError(null);
  
  try {
    const response = 
    await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${postsPerPage}`);
    if(!response.ok){throw new Error("Post fetch failed..!");}
    // console.log(await response.json())
    const data=await response.json();
    setPosts(data);
    const total = response.headers.get("X-Total-Count");
    const totalPages = Math.ceil(total/postsPerPage);
    const buttons = [];
    for(let i=1; i<=totalPages; i++){
      buttons.push({text : i.toString(), "data-id" : i});
    }
    setPaginationButtons(buttons);    
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
}
useEffect(()=>{
  const getAllPosts=async()=>{
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
      const allPost = await response.json()
      setAllPosts(allPost)
      
    } catch (error) {
      
    }
  }
  
  if(seletedUser){
    getAllPosts()
    console.log("selectedUser :",seletedUser,"posts :", posts)
    // console.log(allPosts);
    const seletedUsersPosts = allPosts.filter(post=> post.userId == seletedUser)
    console.log("seletedUsersPosts :",seletedUsersPosts)
    setPosts(seletedUsersPosts)
  }
},[seletedUser])


const handlePageClick = (pageNumber) =>{
  fetchPosts(pageNumber);
  setCurrentPage(pageNumber);
};

const handleSelectUser=(e)=>{
  setSelectedUser(e.target.value)
}

  return (
    <div className='container'>
      {displayPopUp? <Modal displayPopUp={displayPopUp} setDisplayPopUp={setDisplayPopUp} onClose={onClose}/> : null}

      <div className="users">
        <select value={seletedUser} name="" id="" onChange={handleSelectUser}>
          <option value="" label='See Posts by User'>Select User</option>         

          {users.map(
            (user)=> (
                <option value={user.id} key={user.id} className='option'>
                {user.name}
                </option>
              )
              
            )}          
        </select>
      </div>

      {/* <button 
        className='fetch-button'
        onClick={()=>fetchPosts(1)}
        disabled={loading}
      >
        {loading?"Loading":"Show Posts"}
      </button> */}
      
      {error && <div className="error">Error : {error}</div>}

      {posts.map(
        (post)=>(
          <div key={post.id} className="post">
            <code>UserID : {post.userId}</code>
            <h2 className='post-title'>{post.title}</h2>
            <p className='post-body'>{post.body}</p>
          </div>
        ))}

      {paginationButtons.length>0 && (
        <div className="pagination">
          {paginationButtons.map((button)=>(
            <button
              key={button["data-id"]}
              onClick={()=>handlePageClick(button["data-id"])}
              className={`page-button ${currentPage===button["data-id"]? "active":""}`}
              data-id={button["data-id"]}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default App
