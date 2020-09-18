import React, { useState, useEffect } from "react"
import Layout from "../components/layout"

//API Imports
import { API, graphqlOperation } from "aws-amplify"
import { createNote } from "../graphql/mutations"
import { listNotes } from "../graphql/queries"

//Amplify Configure
import Amplify, { Hub, Auth } from "aws-amplify"
import awsconfig from "../aws-exports"
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react"

Amplify.configure(awsconfig)

const NotesPage = () => {
  const [newNote, setnewNote] = useState({ title: "", body: "" })
  const [notes, setNotes] = useState([])
  const [isUserLoggedIn, setIsUSerLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState([])

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      if (event === "signIn") {
        // user is signed in
        setIsUSerLoggedIn(true)
      }
    })
  }, [])

  useEffect(() => {
    // fetch all the notes
    fetchNotes()
  }, [isUserLoggedIn])

  useEffect(() => {
    function loadUser() {
      return Auth.currentAuthenticatedUser({ bypassCache: true })
    }
    async function onLoad() {
      try {
        const user = await loadUser()
        setUser(user)

        console.log(user)
      } catch (error) {
        console.log("error in fetching notes")
      }
    }

    onLoad()
  }, [isUserLoggedIn])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const notesData = await API.graphql(graphqlOperation(listNotes))
      const notes = notesData.data.listNotes.items
      setNotes(notes)
      setLoading(false)
    } catch (error) {
      console.log("error in fetching notes")
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (!newNote.title.length || !newNote.body.length) return
      //create note in backend[TODO]
      await API.graphql(graphqlOperation(createNote, { input: newNote }))
      setNotes([newNote, ...notes])
      setnewNote({ title: "", body: "" })
    } catch (error) {
      console.log("Error in Creating the notes")
    }
  }

  return (
    <Layout>
      <AmplifyAuthenticator>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <h1>{user.username}'s Personal Notes</h1>
          <AmplifySignOut />
        </div>

        <form onSubmit={handleSubmit}>
          <p>
            <input
              type="text"
              placeholder="Note Title"
              style={{ width: "50%", fontSize: "15px" }}
              value={newNote.title}
              onChange={e => setnewNote({ ...newNote, title: e.target.value })}
            ></input>
          </p>
          <p>
            <textarea
              rows="4"
              placeholder="Note Body"
              style={{ width: "70%", fontSize: "15px" }}
              value={newNote.body}
              onChange={e => setnewNote({ ...newNote, body: e.target.value })}
            ></textarea>
          </p>
          <p>
            <input
              type="submit"
              style={{ width: "30%", height: "30px" }}
              value="Add Note"
            ></input>
          </p>
        </form>

        <hr />
        {loading ? <h2>Loading...</h2> : <span></span>}
        {notes.map((note, index) => (
          <div key={index}>
            <h2>{note.title}</h2>
            <p>{note.body}</p>
            <hr />
          </div>
        ))}
      </AmplifyAuthenticator>
    </Layout>
  )
}

export default NotesPage
