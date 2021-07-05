// BUILD YOUR SERVER HERE

const express = require('express')

const User = require('./users/model')

const server = express()

server.use(express.json())

// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                   |

server.post('/api/users', (req, res) => {
    if(!req.body.name || !req.body.bio) {
        res.status(400).json({message: "Please provide name and bio for the user"})
    }
    else {
        const {name, bio} = req.body
        User.insert({name, bio})
            .then(user => {
                res.status(201).json(user)
            })
            .catch(() => {
                res.status(500).json({message: "There was an error while saving the user to the database"})
            })    
    }
})


// | GET    | /api/users     | Returns an array users.                                                                                |

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(() => {
            res.status(500).json({message: "The users information could not be retrieved"})
        }) 
})

// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                       |

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            if(!user) {
                res.status(404).json({message: `The user with the specified ID ${id} does not exist`})
            }
            else {
                res.status(200).json(user)
            }
        })
        .catch(() => {
            res.status(500).json({message: "The user information could not be retrieved"})
        }) 
})

// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                 |

server.delete('/api/users/:id', async (req, res) => {
    try {
        const result = await User.remove(req.params.id)
        if(!result) {
            res.status(404).json({message: `The user with the specified ID ${req.params.id} does not exist`})
        }
        else {
            res.json(result)
        }
    } 
    catch(err) {
        res.status(500).json({message: "The user could not be removed"})
    }
})

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id
    const {name, bio} = req.body
    if(!name || !bio) {
        res.status(400).json({message: "Please provide name and bio for the user"})
    }
    else {
        User.update(id, {name, bio})
            .then(updated => {
                if(!updated) {
                    res.status(404).json({message: "The user with the specified ID does not exist"})
                }
                else {
                    res.status(200).json(updated)
                }
            })
            .catch(() => {
                res.status(500).json({message: "The user information could not be modified"})
            })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
