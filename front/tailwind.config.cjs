/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
		animation: {
			'idle': "idle 12s infinite",
			'halo-idle': "halo-idle halo-pulse-idle pulse 20s infinite",
			'spin-slow' : "spin 5s linear infinite",
			'pulse-slow' : "pulse 2s infinite"
		},
        colors: {
            'color1' : '#FFD700',
            'color2' : '#2F83E4',
            'color3' : '#6356AF',
            'color4' : '#2A2358',
            'color5' : '#001329',
            'color6' : '#002047',
			'gold' : {
				'100' : '#e0c56e',
				'200' : '#d4af37',
				'300' : '#b08f26',
				'400' : '#e8b923',
				'500' : '#daa520'
			},
			'silver' : {
				'100' : '#d5d5d7',
				'200' : '#aaa9ad',
				'300' : '#87868c'
			},
			'copper' : {
				'100' : '#d09156',
				'200' : '#b87333',
				'300' : '#935c29',
				'400' : '#c97222'
			},
			'thread-blue' : '#599ac2',
			'process-green' : '#70af85',
			'core-red' : '#b23256'
        },
        fontFamily: {
			'arial-black': ['arial black'],
			'arial': ['arial'],
        },
		keyframes: {
			'idle': {
				'0%' : {
					transform: "translate(0px, 0px) scale(1)",
					opacity: 0
				},
				'25%' : {
					transform: "translate(50%, 0%) scale(5)",
					opacity: 0.1
				},
				'50%' : {
					transform: "translate(0%, -100%) scale(5)",
					opacity: 0.8
				},
				'75%' : {
					transform: "translate(0px, 0px) scale(0.5)",
					opacity: 0.1
				},
				'100%' : {
					transform: "translate(0px, 0px) scale(1)",
					opacity: 0
				}
			},
			'halo-idle': {
				'0%' : {
					transform: "scale(1)",
					opacity: 1
				},
				'25%' : {
					transform: " scale(1.3)",
					opacity: 0.8
				},
				'50%' : {
					transform: "scale(1.1)",
				},
				'75%' : {
					transform: "scale(1.2)"
				},
				'100%' : {
					transform: "scale(1)"
				}
			},
			'halo-pulse-idle': {
				'0%' : {
					opacity: 1
				},
				'33%' : {
					opacity: 0.8
				},
				'66%' : {
					opacity: 0.5
				},
				'100%' : {
					opactiy: 1
				}
			}
		}
    },
  },
  plugins: [],
}
