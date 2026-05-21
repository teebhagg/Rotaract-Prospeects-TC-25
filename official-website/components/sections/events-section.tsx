"use client";

import { EventCard } from "@/components/cards/event-card";
import { SectionContainer } from "@/components/layout/section-container";
import { Button } from "@/components/ui/button";
import { staggerContainer } from "@/lib/animations";
import { Event } from "@/sanity/types";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface EventsSectionProps {
  events?: Event[];
}

export function EventsSection({ events }: EventsSectionProps) {
  if (!events || events.length === 0) return null;

  const upcomingEvents = events
    .filter((e) => e.eventType === "upcoming")
    .slice(0, 3);

  if (upcomingEvents.length === 0) return null;

  return (
    <SectionContainer variant="accent">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <div className="mb-12">
          <span className="block h-1 w-12 bg-coral-500 mb-4" />
          <h2 className="text-3xl font-extrabold sm:text-4xl text-charcoal-900">
            Upcoming Events
          </h2>
          <p className="mt-3 text-lg text-charcoal-500 max-w-xl">
            What&apos;s coming up
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-7 top-0 bottom-0 w-px bg-coral-200 hidden md:block" />

          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <div key={event._id} className="md:pl-16">
                <EventCard event={event} index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/events">
            <Button variant="outline" className="group">
              View All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
