// export const environment = {
// 	  production: true,
// 	 // apiUrl: "https://localhost:5001",
//   apiUrl: "http://rajasabiq-001-site1.itempurl.com",
// };

export const environment = {
	production: true,
	baseUrl: window["env"]["apiUrl"] || "",
	debug: window["env"]["debug"] || false,
  };
