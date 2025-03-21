"use client";

import { Crop, FileVideo, Layers, Zap, Cloud, Eye } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";
import { motion } from "framer-motion";

export function GlowingEffectDemo() {
    return (
        <div className="container mx-auto py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Powerful Features
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our AI-powered video processing tool offers everything you need to
                    optimize your content for any platform.
                </p>
            </motion.div>

            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] p-10 xl:grid-rows-2">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                    icon={<Crop size={24} />}
                    title="Automatic Resizing"
                    description="AI-powered smart cropping that keeps the important content in frame, no matter the aspect ratio."
                />

                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                    icon={<FileVideo size={24} />}
                    title="Format Conversion"
                    description="Convert between any video format with optimized compression to maintain quality while reducing file size."
                />

                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                    icon={<Layers size={24} />}
                    title="Platform Templates"
                    description="Pre-configured settings for all major platforms including YouTube, Instagram, TikTok, and more. Lorem ipsum dolor sit amet, consectetur adipiscing elit. real time datafetching"
                />

                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                    icon={<Eye size={24} />}
                    title="Real-time Preview"
                    description="See exactly how your video will look on each platform before finalizing the conversion."
                />

                <GridItem
                    area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                    icon={<Zap size={24} />}
                    title="Batch Processing"
                    description="Process multiple videos simultaneously to save time and streamline your workflow."
                />

               
            </ul>
        </div>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={`min-h-[14rem] list-none ${area}`}>
            <div className="relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-600 p-2 ">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black dark:text-white">
                                {title}
                            </h3>
                            <h2
                                className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] 
              md:text-base/[1.375rem]  text-black dark:text-neutral-400"
                            >
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
