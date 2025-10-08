
import { fontOptions } from './font-options';
import { gradientTemplates } from './colors';

export type DesignTemplate = {
  id: string;
  name: string;
  previewImage: string;
  background: {
    type: 'flat' | 'gradient' | 'image';
    value: string;
  };
  font: {
    value: string;
    color: string;
  };
  textBox: {
    color: string;
    opacity: number;
  };
  overlay: {
    color: string;
    opacity: number;
  };
};

export const designTemplates: DesignTemplate[] = [

  {
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#143A63',
    },
    font: {
      value: 'arsenal',
      color: '#FD6749',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#3567DB',
    },
    font: {
      value: 'arsenal',
      color: '#FEDAFB',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#1C2551',
    },
    font: {
      value: 'arsenal',
      color: '#23CBD2',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#0A406E',
    },
    font: {
      value: 'arsenal',
      color: '#06CCA0',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#002778',
    },
    font: {
      value: 'arsenal',
      color: '#FFD40B',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#2846D3',
    },
    font: {
      value: 'arsenal',
      color: '#CECBC9',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#03335F',
    },
    font: {
      value: 'arsenal',
      color: '#0ECDE1',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#334363',
    },
    font: {
      value: 'arsenal',
      color: '#DE918C',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#272D50',
    },
    font: {
      value: 'arsenal',
      color: '#36C4C7',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#453F90',
    },
    font: {
      value: 'arsenal',
      color: '#CD3536',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#004973',
    },
    font: {
      value: 'arsenal',
      color: '#FCF900',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#2C2B9B',
    },
    font: {
      value: 'arsenal',
      color: '#DB141C',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#1A2B76',
    },
    font: {
      value: 'arsenal',
      color: '#B41EDF',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#6070B6',
    },
    font: {
      value: 'arsenal',
      color: '#F2EEF2',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#D5301C',
    },
    font: {
      value: 'arsenal',
      color: '#047976',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#ED0400',
    },
    font: {
      value: 'arsenal',
      color: '#FAC800',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#DD2260',
    },
    font: {
      value: 'arsenal',
      color: '#0C2955',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#F4BE05',
    },
    font: {
      value: 'arsenal',
      color: '#984DAE',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#F7F1D2',
    },
    font: {
      value: 'arsenal',
      color: '#DD9DBA',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#DDFD00',
    },
    font: {
      value: 'arsenal',
      color: '#F94071',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#FFEF58',
    },
    font: {
      value: 'arsenal',
      color: '#2D3440',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#FDF7C1',
    },
    font: {
      value: 'arsenal',
      color: '#49CDAE',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#14473F',
    },
    font: {
      value: 'arsenal',
      color: '#12BA24',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#0FCE3E',
    },
    font: {
      value: 'arsenal',
      color: '#104462',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#4A5E46',
    },
    font: {
      value: 'arsenal',
      color: '#B5CEC1',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#192D1B',
    },
    font: {
      value: 'arsenal',
      color: '#D6C3CD',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#A2CA57',
    },
    font: {
      value: 'arsenal',
      color: '#2B5251',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#041F2A',
    },
    font: {
      value: 'arsenal',
      color: '#96DEA7',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#00FC69',
    },
    font: {
      value: 'arsenal',
      color: '#5C0089',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#062129',
    },
    font: {
      value: 'arsenal',
      color: '#9DDBA8',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#19CBB1',
    },
    font: {
      value: 'arsenal',
      color: '#394155',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#1B4946',
    },
    font: {
      value: 'arsenal',
      color: '#DA9688',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#2EC28A',
    },
    font: {
      value: 'arsenal',
      color: '#1E515D',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#02D7B5',
    },
    font: {
      value: 'arsenal',
      color: '#383E53',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#084047',
    },
    font: {
      value: 'arsenal',
      color: '#DC948D',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#004548',
    },
    font: {
      value: 'arsenal',
      color: '#E87868',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#68D9D6',
    },
    font: {
      value: 'arsenal',
      color: '#8C53B5',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#006B99',
    },
    font: {
      value: 'arsenal',
      color: '#E0CAE8',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
{
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#3889AC',
    },
    font: {
      value: 'arsenal',
      color: '#ECDDC8',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
  {
    id: 'solid-arsenal',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#40ffa7',
    },
    font: {
      value: 'arsenal',
      color: '#050761',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
  {
    id: 'solid-arsenal2',
    name: "New Template Name",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#050761',
    },
    font: {
      value: 'arsenal',
      color: '#40ffa7',
    },
  textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
  {
    id: 'template-1',
    name: "Classic Read",
    previewImage: "https://i.ibb.co/60jqfPL/12.jpg",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    font: {
      value: 'special-elite',
      color: '#1A2E3B',
    },
    textBox: {
      color: '#EDE8E4',
      opacity: 0.75,
    },
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  },
  {
    id: 'template-2',
    name: "Bold Statement",
    previewImage: "https://i.ibb.co/JqWk8Vk/image.png",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    font: {
      value: 'anton',
      color: '#FFFFFF',
    },
    textBox: {
      color: '#000000',
      opacity: 0,
    },
    overlay: {
      color: '#000000',
      opacity: 0.3,
    },
  },
  {
    id: 'template-3',
    name: "Serene Gradient",
    previewImage: "https://i.ibb.co/k4H8kcn/template-3-preview.jpg",
    background: {
      type: 'gradient',
      value: gradientTemplates.find(g => g.name === 'Royal')?.css || gradientTemplates[0].css,
    },
    font: {
      value: 'josefin-sans',
      color: '#FFFFFF', 
    },
    textBox: {
      color: '#FFFFFF',
      opacity: 0.15,
    },
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  },
  {
    id: 'template-4',
    name: "Minimalist Black",
    previewImage: "https://i.ibb.co/pPZ7hys/image.png",
    background: {
      type: 'flat',
      value: '#000000',
    },
    font: {
      value: 'inter',
      color: '#FFFFFF',
    },
    textBox: {
      color: '#FFFFFF',
      opacity: 0,
    },
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  },
  {
    id: 'template-5',
    name: "Sunrise Gradient",
    previewImage: "https://i.ibb.co/yQWJzC6/image.png",
    background: {
      type: 'gradient',
      value: gradientTemplates.find(g => g.name === 'Peach')?.css || gradientTemplates[12].css,
    },
    font: {
      value: 'bree-serif',
      color: '#3D2C24',
    },
    textBox: {
      color: '#FFFFFF',
      opacity: 0,
    },
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  },
    {
    id: 'template-6',
    name: "Oceanic Blue",
    previewImage: "https://i.ibb.co/3sYK3mG/image.png",
    background: {
      type: 'flat',
      value: '#004AAD',
    },
    font: {
      value: 'lato',
      color: '#0F2027',
    },
    textBox: {
      color: '#E0F7FF',
      opacity: 1,
    },
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  }
];
