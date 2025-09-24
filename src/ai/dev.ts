'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/automatically-split-text-into-paragraphs.ts';
import '@/ai/flows/find-images-flow.ts';
