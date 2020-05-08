const { date, age } = require('../../lib/util')
const Teacher = require('../models/Teacher')


module.exports = {

  index(req, res) {

    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 2
    let offset = limit * (page - 1)

    let params = {
      filter,
      page,
      limit,
      offset,
      callback(teachers){
        return res.render("teachers/index", { filter, teachers })
      }
    }

    Teacher.pagination(params)



    // if (filter) {
    //   Teacher.findBy(filter, function (teachers) {
    //     return res.render("teachers/index", { filter, teachers })
    //   })
    // } else {
    //   Teacher.all(function (teachers) {
    //     return res.render("teachers/index", { teachers })
    //   })
    // }




  },
  create(req, res) {

    return res.render("teachers/create")


  },
  post(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    Teacher.create(req.body, function (teacher) {
      return res.redirect(`/teachers/${teacher.id}`)
    })


  },
  show(req, res) {



    Teacher.find(req.params.id, function (teacher) {
      if (!teacher) res.send('Teacher not found')

      teacher.birth_date = age(teacher.birth_date)
      teacher.subjects_taught = teacher.subjects_taught.split(",")
      teacher.created_at = date(teacher.created_at).format

      return res.render(`teachers/show`, { teacher })
    })

  },
  edit(req, res) {

    Teacher.find(req.params.id, function (teacher) {
      if (!teacher) res.send('Teacher not found')

      teacher.birth_date = date(teacher.birth_date).iso

      return res.render(`teachers/edit`, { teacher })
    })

  },
  put(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    Teacher.update(req.body, function () {
      return res.redirect(`/teachers/${req.body.id}`)
    })

  },
  delete(req, res) {

    Teacher.delete(req.body.id, function () {
      return res.redirect('teachers')
    })

  },
}