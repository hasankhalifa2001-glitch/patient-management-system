'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
  username: z.string().min(2, {
    error: "Username must be at least 2 characters"
  }).max(50)
})

const PatientForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ""
    }
  })

  function onSubmit(value: z.infer<typeof formSchema>) {
    console.log(value)
  }
  return (
    <div></div>
  )
}

export default PatientForm