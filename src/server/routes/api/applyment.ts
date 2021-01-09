import { auth, required } from '@/server/middlewares'
import { abandon, accept, apply, find, reject } from '@/server/applyment'

import { Router } from 'express'

const router = Router()

router.post('/', auth, required('job', 'resume'), async (req, res) => {
    let result = await apply({
        job: req.body.job,
        resume: req.body.resume,
        applicant: req.account!.id
    })

    if (typeof result === 'number') {
        res.status(result).json()
    } else {
        res.status(201).json(result)
    }
})

router.get('/', auth, async (req, res) => {
    let job = req.query.job as string
    let applicant = req.query.applicant as string
    let result = await find(job, applicant)

    if (typeof result === 'number') {
        res.status(result).json()
    } else {
        res.status(200).json(result)
    }
})

router.post('/:id/accept', auth, async (req, res) => {
    let result = await accept(req.params.id)
    if (typeof result === 'number') {
        res.status(result).json()
    } else {
        res.status(200).json(result)
    }
})

router.post('/:id/reject', auth, async (req, res) => {
    let result = await reject(req.params.id)
    if (typeof result === 'number') {
        res.status(result).json()
    } else {
        res.status(200).json(result)
    }
})

router.post('/:id/confirm', auth, async (req, res) => {
    let result = await confirm(req.params.id)
    if (typeof result === 'number') {
        res.status(result).json()
    } else {
        res.status(200).json(result)
    }
})

router.post('/:id/abandon', auth, async (req, res) => {
    let result = await abandon(req.params.id)
    if (typeof result === 'number') {
        res.status(result).json()
    } else {
        res.status(200).json(result)
    }
})

export default router
