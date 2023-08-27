// import styles from "./icons.module.scss";

export function RaycastLightIcon() {
  return (
    <svg
      width="1024"
      height="1024"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M934.302 511.971L890.259 556.017L723.156 388.902V300.754L934.302 511.971ZM511.897 89.5373L467.854 133.583L634.957 300.698H723.099L511.897 89.5373ZM417.334 184.275L373.235 228.377L445.776 300.923H533.918L417.334 184.275ZM723.099 490.061V578.209L795.641 650.755L839.74 606.652L723.099 490.061ZM697.868 653.965L723.099 628.732H395.313V300.754L370.081 325.987L322.772 278.675L278.56 322.833L325.869 370.146L300.638 395.379V446.071L228.097 373.525L183.997 417.627L300.638 534.275V634.871L133.59 467.925L89.4912 512.027L511.897 934.461L555.996 890.359L388.892 723.244H489.875L606.516 839.892L650.615 795.79L578.074 723.244H628.762L653.994 698.011L701.303 745.323L745.402 701.221L697.868 653.965Z"
        fill="#FF6363"
      />
    </svg>
  );
}

export function WindowIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.25 4.75V3.75C14.25 2.64543 13.3546 1.75 12.25 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V4.75M14.25 4.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H3.75C2.64543 14.25 1.75 13.3546 1.75 12.25V4.75M14.25 4.75H1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FinderIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 4.75V6.25M11 4.75V6.25M8.75 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V12.25C1.75 13.3546 2.64543 14.25 3.75 14.25H8.75M8.75 1.75H12.25C13.3546 1.75 14.25 2.64543 14.25 3.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H8.75M8.75 1.75L7.08831 7.1505C6.9202 7.69686 7.32873 8.25 7.90037 8.25C8.36961 8.25 8.75 8.63039 8.75 9.09963V14.25M5 10.3203C5 10.3203 5.95605 11.25 8 11.25C10.0439 11.25 11 10.3203 11 10.3203"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.43376 2.17103C7.60585 1.60966 8.39415 1.60966 8.56624 2.17103L9.61978 5.60769C9.69652 5.85802 9.92611 6.02873 10.186 6.02873H13.6562C14.2231 6.02873 14.4665 6.75397 14.016 7.10088L11.1582 9.3015C10.9608 9.45349 10.8784 9.71341 10.9518 9.95262L12.0311 13.4735C12.2015 14.0292 11.5636 14.4777 11.1051 14.1246L8.35978 12.0106C8.14737 11.847 7.85263 11.847 7.64022 12.0106L4.89491 14.1246C4.43638 14.4777 3.79852 14.0292 3.96889 13.4735L5.04824 9.95262C5.12157 9.71341 5.03915 9.45349 4.84178 9.3015L1.98404 7.10088C1.53355 6.75397 1.77692 6.02873 2.34382 6.02873H5.81398C6.07389 6.02873 6.30348 5.85802 6.38022 5.60769L7.43376 2.17103Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon() {
  return (
    <div cmdk-raycast-user-icon="">
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect
          id="r4"
          width="512"
          height="512"
          x="0"
          y="0"
          rx="128"
          fill="url(#gradient-purple)"
          stroke="#FFFFFF"
          strokeWidth="0"
          strokeOpacity="100%"
          paintOrder="stroke"
        ></rect>
        <clipPath id="clip">
          <use xlinkHref="#r4"></use>
        </clipPath>
        <defs>
          <linearGradient
            id="gradient-purple"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(45)"
            style={{ transformOrigin: "center center" }}
          >
            <stop stopColor="#8E2DE2"></stop>
            <stop offset="1" stopColor="#4A00E0"></stop>
          </linearGradient>
          <radialGradient
            id="r6"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(256) rotate(90) scale(512)"
          >
            <stop stopColor="white"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
          </radialGradient>
        </defs>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="352"
          height="352"
          x="80"
          y="80"
          alignmentBaseline="middle"
          style={{ color: "white" }}
        >
          <path
            d="M10.5 4.25a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM8 9.25c-2.245 0-4.318 1.055-5.134 3.046-.419 1.022.529 1.954 1.633 1.954h7.002c1.104 0 2.052-.932 1.633-1.954C12.318 10.305 10.245 9.25 8 9.25Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </svg>
    </div>
  );
}

export function ToolIcon() {
  return (
    <div cmdk-raycast-tool-icon="">
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect
          id="r4"
          width="512"
          height="512"
          x="0"
          y="0"
          rx="128"
          fill="url(#gradient-red)"
          stroke="#FFFFFF"
          stroke-width="0"
          stroke-opacity="100%"
          paint-order="stroke"
        ></rect>
        <clipPath id="clip">
          <use xlinkHref="#r4"></use>
        </clipPath>
        <defs>
          <linearGradient
            id="gradient-red"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(45)"
            style={{ transformOrigin: "center center" }}
          >
            <stop stop-color="#EAAFC8"></stop>
            <stop offset="1" stop-color="#EC2F4B"></stop>
          </linearGradient>
          <radialGradient
            id="r6"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(256) rotate(90) scale(512)"
          >
            <stop stop-color="white"></stop>
            <stop offset="1" stop-color="white" stop-opacity="0"></stop>
          </radialGradient>
        </defs>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="352"
          height="352"
          x="80"
          y="80"
          alignment-baseline="middle"
          style={{ color: "white" }}
        >
          <path
            d="m1.9 3.65-.53-.53.53.53ZM3.65 1.9l.53.53-.53-.53Zm.704-.004.524-.537-.524.537Zm1.372 2.39a.75.75 0 1 0 1.048-1.072L5.726 4.286ZM3.214 6.774a.75.75 0 0 0 1.072-1.048L3.214 6.774Zm-1.318-2.42-.537.524.537-.524Zm11.272 2.244-.576-.48.576.48ZM14.1 5.48 13.524 5l.576.48Zm-3.047-2.586-.671-.335.67.335Zm.41-.82-.67-.336.67.336ZM10.52 1.9l.48.576-.48-.576Zm-1.118.932-.48-.577.48.577Zm.867 4.59-.238.712.237-.711Zm-1.692-1.69.712-.238-.712.238Zm5.481-1.174.53-.53-.53.53Zm-2.616-2.616-.53.53.53-.53ZM9.01 6.55a.75.75 0 0 0-1.02-1.1l1.02 1.1Zm-7.054 5.526-.51-.55.51.55Zm-.016.864-.53.53.53-.53Zm1.12 1.12-.53.53.53-.53Zm.864-.016-.55-.51.55.51ZM10.55 8.01a.75.75 0 1 0-1.1-1.02l1.1 1.02Zm.48 1.96a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.095 4.155.53.53-.53-.53Zm-.132.12-.45.6.45-.6Zm.013-.001-.53-.53.53.53Zm.238-.238-.53-.53.53.53Zm0-.013.6-.45-.6.45Zm-.955-1.099-.335.671.335-.67ZM2.429 4.181 4.182 2.43 3.12 1.37 1.368 3.12l1.06 1.06Zm1.4-1.75 1.897 1.855 1.048-1.072-1.896-1.855-1.049 1.073Zm.457 3.295L2.432 3.829 1.359 4.878l1.855 1.896 1.072-1.048ZM4.181 2.43a.25.25 0 0 1-.352.002l1.049-1.073a1.25 1.25 0 0 0-1.758.01l1.06 1.06Zm-2.812.69a1.25 1.25 0 0 0-.01 1.758l1.073-1.049a.25.25 0 0 1-.002.352L1.37 3.12Zm12.376 3.958.931-1.118L13.524 5l-.932 1.118 1.153.96ZM11.75 4v-.882h-1.5V4h1.5Zm-.026-.77.41-.821-1.342-.67-.41.82 1.342.67Zm1.867.636-.82.41.67 1.342.82-.41-.67-1.342Zm-.709.384H12v1.5h.882v-1.5ZM10.04 1.324l-1.118.931.96 1.153L11 2.476l-.96-1.152Zm.466 5.387a1.924 1.924 0 0 1-1.217-1.217l-1.423.475a3.424 3.424 0 0 0 2.165 2.165l.475-1.423Zm2.264-2.435a.25.25 0 0 1 .112-.026v1.5c.194 0 .385-.045.559-.132l-.67-1.342Zm-1.02-1.158a.25.25 0 0 1-.026.112l-1.342-.671a1.25 1.25 0 0 0-.132.559h1.5Zm2.838.91a.864.864 0 0 0-.997-.162l.67 1.342a.636.636 0 0 1-.733-.12l1.06-1.06Zm-3.676-1.556a.636.636 0 0 1-.12-.734l1.342.67a.864.864 0 0 0-.162-.996l-1.06 1.06ZM10.25 4c0 .967.784 1.75 1.75 1.75v-1.5a.25.25 0 0 1-.25-.25h-1.5Zm4.426 1.96a1.434 1.434 0 0 0-.088-1.932l-1.06 1.06A.066.066 0 0 1 13.524 5l1.152.96Zm-2.084.158a1.924 1.924 0 0 1-2.086.593l-.475 1.423a3.424 3.424 0 0 0 3.714-1.056l-1.153-.96Zm-3.67-3.863A3.424 3.424 0 0 0 7.866 5.97l1.423-.475a1.924 1.924 0 0 1 .593-2.086l-.96-1.153Zm3.05-.843a1.434 1.434 0 0 0-1.932-.088L11 2.476a.066.066 0 0 1-.088-.004l1.06-1.06ZM7.99 5.45l-6.544 6.077 1.02 1.099L9.01 6.55l-1.02-1.1Zm-6.58 8.02 1.12 1.12 1.06-1.06-1.12-1.12-1.06 1.06Zm3.063 1.084L10.55 8.01l-1.1-1.02-6.076 6.543 1.1 1.021Zm-1.944.036a1.35 1.35 0 0 0 1.944-.036l-1.099-1.02a.15.15 0 0 1 .216-.005L2.53 14.59Zm-1.083-3.063a1.35 1.35 0 0 0-.036 1.944l1.06-1.061a.15.15 0 0 1-.003.216l-1.021-1.1Zm8.524-.497 2 2 1.06-1.06-2-2-1.06 1.06Zm2 2 1.625 1.625 1.06-1.06-1.625-1.625-1.06 1.06Zm-.14-.195.394.79 1.341-.671-.394-.79-1.342.671Zm.909 1.407.804.603.9-1.2-.804-.603-.9 1.2Zm1.797.532.12-.119-1.061-1.06-.12.118 1.062 1.061Zm.12-.119.118-.118-1.06-1.061-.12.119 1.061 1.06Zm.189-1.112-.603-.804-1.2.9.603.804 1.2-.9Zm-1.22-1.32-.79-.394-.67 1.342.789.394.67-1.341Zm.617.516a1.75 1.75 0 0 0-.618-.515l-.67 1.341a.25.25 0 0 1 .088.074l1.2-.9Zm.532 1.797a.76.76 0 0 0 .07-.993l-1.2.9a.74.74 0 0 1 .07-.967l1.06 1.06Zm-1.23.309a.76.76 0 0 0 .992-.07l-1.06-1.061a.74.74 0 0 1 .967-.07l-.9 1.2Zm-1.32-1.22c.121.242.297.454.515.617l.9-1.2a.25.25 0 0 1-.074-.088l-1.341.67Z"
            fill="currentColor"
          ></path>
        </svg>
      </svg>
    </div>
  );
}

export function DatabaseIcon() {
  return (
    <div cmdk-raycast-database-icon="">
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect
          id="r4"
          width="512"
          height="512"
          x="0"
          y="0"
          rx="128"
          fill="url(#r5)"
          stroke="#FFFFFF"
          stroke-width="0"
          stroke-opacity="100%"
          paint-order="stroke"
        ></rect>
        <clipPath id="clip">
          <use xlinkHref="#r4"></use>
        </clipPath>
        <defs>
          <linearGradient
            id="r5"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(45)"
            style={{ transformOrigin: "center center" }}
          >
            <stop stop-color="#99F2C8"></stop>
            <stop offset="1" stop-color="#1F4037"></stop>
          </linearGradient>
          <radialGradient
            id="r6"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(256) rotate(90) scale(512)"
          >
            <stop stop-color="white"></stop>
            <stop offset="1" stop-color="white" stop-opacity="0"></stop>
          </radialGradient>
        </defs>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="352"
          height="352"
          x="80"
          y="80"
          alignment-baseline="middle"
          style={{ color: "white" }}
        >
          <path
            d="M1.75 6v4c0 1.243 2.798 2.25 6.25 2.25s6.25-1.007 6.25-2.25V6M1.75 6c0 1.243 2.798 2.25 6.25 2.25S14.25 7.243 14.25 6M1.75 6c0-1.243 2.798-2.25 6.25-2.25S14.25 4.757 14.25 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </svg>
    </div>
  );
}
