"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Leaf, Microscope, Cpu } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import axios from 'axios'

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function DynamicBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-800 to-purple-800"
        animate={{
          background: [
            "linear-gradient(to right, #2563eb, #1e40af, #5b21b6)",
            "linear-gradient(to right, #3b82f6, #2563eb, #4338ca)",
            "linear-gradient(to right, #60a5fa, #3b82f6, #6366f1)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="absolute inset-0 bg-black opacity-75" />
    </div>
  )
}

function AnimatedGridBackground() {
  return (
    <motion.div className="grid-background">
      {Array.from({ length: 50 }).map((_, index) => (
        <motion.div
          key={index}
          className="grid-item"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.02 }}
        />
      ))}
    </motion.div>
  )
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const teamMemberVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

// Function to format the prediction string
const formatPrediction = (prediction: string): { plant: string, disease: string } => {
  const parts = prediction.split('___')
  if (parts.length === 2) {
    const plant = parts[0].replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    let disease = parts[1].replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    
    // Check if the disease is "Healthy" and replace it with "No Disease"
    if (disease.toLowerCase() === 'healthy') {
      disease = 'No Disease'
    }
    
    return { plant, disease }
  }
  return { plant: 'Unknown', disease: 'Unknown' }
}

// Ensure the default export is a valid React component
export default function Page() {
  const [isUploading, setIsUploading] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setAnalysisResult(null)
      const reader = new FileReader()
      reader.onload = async (e) => {
        setUploadedImage(e.target?.result as string)
        setIsUploading(false)
        setIsPredicting(true)

        try {
          const formData = new FormData()
          formData.append('file', file)

          const response = await axios.post('http://127.0.0.1:5000/api/predict', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })

          setIsPredicting(false)
          const { plant, disease } = formatPrediction(response.data.prediction)
          setAnalysisResult(`Detected plant: ${plant}\nDetected disease: ${disease}`)
        } catch (error) {
          console.error('Error predicting disease:', error)
          setIsPredicting(false)
          setAnalysisResult('Error analyzing image. Please try again.')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const teamMembers = [
    { name: "Soumyajit Roy", github: "https://github.com/roysammy123", linkedin: "https://www.linkedin.com/in/roysoumyajit36/" },
    { name: "Manav Malhotra", github: "https://github.com/Manav173", linkedin: "https://www.linkedin.com/in/manavmalhotra173/" },
    { name: "Swarnav Kumar", github: "https://github.com/Swarnav-Kumar", linkedin: "https://www.linkedin.com/in/swarnavkumar/" },
    { name: "Saksham Chhawan", github: "https://github.com/sakshamchhawan18", linkedin: "https://www.linkedin.com/in/sakshamchhawan/" },
    { name: "Madhurima Aich", github: "https://github.com/Madhurima1826", linkedin: "https://www.linkedin.com/in/madhurimaaich/" },
    { name: "Ishtaj Kaur Deol", github: "https://github.com/ishtaj", linkedin: "https://www.linkedin.com/in/ishtajkaurdeol/" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const teamRef = useRef(null)
  const isTeamInView = useInView(teamRef, { once: true, amount: 0.2 })

  const uploadRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "min-h-screen bg-black text-white"
      )}
    >
      <div className="flex flex-col min-h-screen bg-black text-white">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800 relative z-10">
          <Link className="flex items-center justify-center" href="#">
            <Leaf className="h-6 w-6 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-white">Plant Disease Detector</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            {["How It Works", "Upload", "Team", "Model"].map((item) => (
              <motion.div key={item} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link className="text-sm font-medium hover:text-blue-400 transition-colors" href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
        </header>
        <main className="flex-1">
          <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
            <DynamicBackground />
            <div className="container px-4 md:px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center space-y-4 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                    Plant Disease Detection
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                    Upload an image of your plant and our AI will detect any diseases. Fast, accurate, and easy to use.
                  </p>
                </div>
                <div className="space-x-4">
                  <Button 
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => scrollToSection(uploadRef)}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    onClick={() => scrollToSection(howItWorksRef)}
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
          <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-950" ref={howItWorksRef}>
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-white">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Upload, title: "Upload Image", content: "Take a clear photo of the affected plant and upload it to our platform." },
                  { icon: Cpu, title: "AI Analysis", content: "Our advanced CNN model analyzes the image to detect any signs of disease." },
                  { icon: Microscope, title: "Get Results", content: "Receive a detailed report on the detected disease and recommended treatments." }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="bg-black border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-400">
                          <item.icon className="h-6 w-6" />
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-400">{item.content}</CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <section id="upload" className="w-full py-12 md:py-24 lg:py-32 bg-black" ref={uploadRef}>
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-white">
                Upload Your Plant Image
              </h2>
              <div className="max-w-md mx-auto">
                <Card className="bg-gray-950 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.05, borderColor: "#3b82f6" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <AnimatePresence>
                          {isUploading ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"
                            />
                          ) : uploadedImage ? (
                            <Image src={uploadedImage} alt="Uploaded plant" layout="fill" objectFit="cover" />
                          ) : (
                            <Upload className="h-12 w-12 text-blue-400" />
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <Input id="picture" type="file" className="sr-only" onChange={handleUpload} />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="w-full bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => document.getElementById('picture')?.click()}
                          disabled={isUploading || isPredicting}
                        >
                          {isUploading ? 'Uploading...' : 'Select Image'}
                        </Button>
                      </motion.div>
                      {isPredicting && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150" />
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300" />
                          <span className="text-blue-400">Analyzing image...</span>
                        </motion.div>
                      )}
                      {analysisResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-blue-900 text-white rounded-lg w-full"
                        >
                          <h3 className="font-semibold mb-2">Analysis Result:</h3>
                          <p style={{ whiteSpace: 'pre-line' }}>{analysisResult}</p>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section id="team" className="w-full py-12 md:py-24 lg:py-32 bg-gray-950" ref={teamRef}>
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-white">
                Our Team
              </h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate={isTeamInView ? "visible" : "hidden"}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={teamMemberVariants}
                    className="bg-black p-4 rounded-lg shadow border border-gray-800"
                  >
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <div className="mt-2">
                      <motion.a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 mr-4"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        GitHub
                      </motion.a>
                      <motion.a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        LinkedIn
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          <section id="model" className="w-full py-12 md:py-24 lg:py-32 bg-black">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-white">
                Our CNN Model
              </h2>
              <AnimatedSection>
                <Card className="bg-gray-950 border-gray-800">
                  <CardContent className="pt-6">
                    <p className="text-center mb-4 text-gray-400">
                      We use a state-of-the-art Convolutional Neural Network (CNN) for accurate plant disease detection.
                    </p>
                    <motion.ul
                      className="list-disc list-inside space-y-2 text-gray-400"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {[
                        "Trained on a dataset of over 100,000 plant images",
                        "Achieves 92% accuracy in disease detection",
                        "Can identify over 50 different plant diseases across various species",
                        "Continuously updated with new data for improved performance"
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          variants={listItemVariants}
                          transition={{ duration: 0.3 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
          <p className="text-xs text-gray-400">© 2024 Plant Disease Detector. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:text-blue-400 transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:text-blue-400 transition-colors" href="#">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
      <AnimatedGridBackground />
    </motion.div>
  )
}