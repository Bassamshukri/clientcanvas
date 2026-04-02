export const PRESET_TEMPLATES = [
  {
    id: "webinar-1",
    title: "Business Webinar",
    thumbnail: "https://plus.unsplash.com/premium_photo-1661342416021-995b05f2479f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    json: {
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1080,
          height: 540,
          fill: "#0e1217",
          selectable: false
        },
        {
          type: "textbox",
          left: 80,
          top: 120,
          width: 920,
          text: "MASTERING THE\nDIGITAL CANVAS",
          fontSize: 82,
          fontWeight: "900",
          fill: "#ffffff",
          fontFamily: "Inter"
        },
        {
          type: "textbox",
          left: 80,
          top: 340,
          width: 600,
          text: "Join our exclusive workshop on modern design systems.",
          fontSize: 24,
          fill: "#8b3dff",
          fontFamily: "Inter"
        },
        {
          type: "polygon",
          left: 850,
          top: 80,
          points: [{x:0,y:60},{x:35,y:0},{x:70,y:60}],
          fill: "#00c896",
          scaleX: 2,
          scaleY: 2
        }
      ]
    }
  },
  {
    id: "business-card-1",
    title: "Minimalist Portrait",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    json: {
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          left: 540,
          top: 0,
          width: 540,
          height: 1080,
          fill: "#f6f9fc",
          selectable: false
        },
        {
          type: "textbox",
          left: 100,
          top: 400,
          width: 400,
          text: "ALEX\nRIVERA",
          fontSize: 72,
          fontWeight: "800",
          fill: "#0e1217",
          fontFamily: "Inter"
        },
        {
          type: "textbox",
          left: 100,
          top: 580,
          width: 400,
          text: "Senior Creative Director",
          fontSize: 18,
          fontWeight: "500",
          fill: "#8b3dff",
          fontFamily: "Inter",
          charSpacing: 200
        },
        {
          type: "circle",
          left: 100,
          top: 700,
          radius: 10,
          fill: "#00c896"
        }
      ]
    }
  },
  {
    id: "quote-1",
    title: "Inspirational Quote",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    json: {
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: "#8b3dff",
          selectable: false
        },
        {
          type: "textbox",
          left: 140,
          top: 300,
          width: 800,
          text: "\"Design is not just what it looks like and feels like. Design is how it works.\"",
          fontSize: 56,
          fontWeight: "700",
          fill: "#ffffff",
          fontFamily: "Inter",
          textAlign: "center",
          fontStyle: "italic"
        },
        {
          type: "textbox",
          left: 0,
          top: 800,
          width: 1080,
          text: "STEVE JOBS",
          fontSize: 20,
          fontWeight: "900",
          fill: "rgba(255,255,255,0.5)",
          fontFamily: "Inter",
          textAlign: "center",
          charSpacing: 400
        }
      ]
    }
  }
];
