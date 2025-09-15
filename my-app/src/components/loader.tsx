'use client';
import React, { useRef, useEffect, useState } from "react";
import { BsFuelPump } from "react-icons/bs";
import { BiSolidTruck } from "react-icons/bi";
import { motion, useAnimation } from "framer-motion";

export default function Loader() {
    const pumpRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const [targetX, setTargetX] = useState(0);
    const [endX, setEndX] = useState(0);

    useEffect(() => {
        if (pumpRef.current && containerRef.current) {
            const pumpBox = pumpRef.current.getBoundingClientRect();
            const containerBox = containerRef.current.getBoundingClientRect();
            
            const distance = pumpBox.left - containerBox.left - 50; 
            setTargetX(distance);

            const truckWidth = 80; 
            const offScreenDistance = containerBox.width + truckWidth;
            setEndX(offScreenDistance);
        }
    }, []);

    useEffect(() => {
        if (targetX > 0 && endX > 0) {
            controls.start({
                x: [0, targetX, targetX, endX, endX], 
                transition: {
                    x: {
                        duration: 5, 
                        times: [0, 0.4, 0.6, 0.9, 1],
                        repeat: Infinity, // This is the correct property to use for infinite loops
                        ease: "linear",
                    }
                }
            });
        }
    }, [targetX, endX, controls]);

    return (
        <div
            ref={containerRef}
            className="text-white w-full max-w-[800px] overflow-hidden relative h-20 border-b pb-2 border-white flex items-end"
        >
            <motion.div
                className="absolute bottom-0 text-7xl"
                animate={controls}
            >
                <BiSolidTruck className="text-7xl -mb-2" />
            </motion.div>

            <div ref={pumpRef} className="absolute bottom-1 right-0">
                <BsFuelPump className="text-4xl" />
            </div>
        </div>
    );
}