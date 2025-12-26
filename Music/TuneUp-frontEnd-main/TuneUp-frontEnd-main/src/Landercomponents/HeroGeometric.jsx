  import { motion } from "framer-motion"
  import { cn } from "../components/lib/utils"
  import "./HeroGeometric.css"
  import { Headphones, Mic2, Share2, Radio, ArrowRight } from "lucide-react"
  import { Link } from "react-router-dom";
  import StickyHeader from "./header/StickyHeader";

  function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
        animate={{ opacity: 1, y: 0, rotate: rotate }}
        transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
        className={cn("absolute", className)}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ width, height }}
          className="relative"
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-gradient-to-r to-transparent",
              gradient,
              "backdrop-blur-[2px] border-2 border-white/[0.15]",
              "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
              "after:absolute after:inset-0 after:rounded-full",
              "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
            )}
          />
        </motion.div>
      </motion.div>
    )
  }

  export default function HeroGeometric() {
    const fadeUpVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] },
      }),
    }

    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#030303] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-rose-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-violet-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />
          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-amber-500/[0.15]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />
          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-cyan-500/[0.15]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
          <ElegantShape
  delay={0.8}
  width={250}
  height={70}
  rotate={15}
  gradient="from-green-500/[0.15]"
  className="right-[10%] md:right-[15%] bottom-[15%] md:bottom-[20%]"
/>

<ElegantShape
  delay={0.9}
  width={400}
  height={120}
  rotate={-18}
  gradient="from-orange-500/[0.15]"
  className="left-[10%] md:left-[12%] top-[50%] md:top-[55%]"
/>

<ElegantShape
  delay={1.0}
  width={500}
  height={150}
  rotate={30}
  gradient="from-blue-500/[0.15]"
  className="right-[-15%] md:right-[-10%] top-[30%] md:top-[35%]"
/>

        </div>


        <div className="relative z-10">
          <StickyHeader/>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
                  <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                      Elevate Your Music
                    </span>
                    <br />
                    <span
                      className={cn(
                        "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
                        "font-pacifico",
                      )}
                    >
                      Your way
                    </span>
                  </h1>
                </motion.div>
                <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
                  <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                    Discover, play, and share music like never before with our innovative platform.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: <Headphones className="h-10 w-10" />,
                    title: "Smart Playlists",
                    description: "Create dynamic playlists that adapt to your listening habits.",
                  },
                  {
                    icon: <Mic2 className="h-10 w-10" />,
                    title: "Lyrics Sync",
                    description: "Sing along with real-time synchronized lyrics.",
                  },
                  {
                    icon: <Share2 className="h-10 w-10" />,
                    title: "Social Sharing",
                    description: "Share your favorite tracks and playlists with friends.",
                  },
                  {
                    icon: <Radio className="h-10 w-10" />,
                    title: "Offline Mode",
                    description: "Enjoy your music anywhere, even without an internet connection.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-lg p-6 flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Updated CTA Section */}
          <section className="py-20 relative overflow-hidden">
  <div className="container mx-auto px-4 md:px-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-r from-indigo-500/20 to-rose-500/20 rounded-3xl p-8 md:p-12 backdrop-blur-lg border border-white/10"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300"
        >
          Ready to Transform Your Music Experience?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 text-white/70 text-lg"
        >
          Join millions of music lovers and start your journey today.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link to="/SignUp">
            <motion.button
              className="group bg-white text-black font-semibold py-3 px-8 rounded-full hover:bg-white/90 transition-colors inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: 5 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.6 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </div>
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-rose-500/5 pointer-events-none" />
</section>

          {/* Footer */}
          <footer className="py-10 text-center">
            <div className="container mx-auto px-4 md:px-6">
              <p className="text-white/50">&copy; 2023 Your Music Platform. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    )
  }

