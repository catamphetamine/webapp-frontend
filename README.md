Some experiments on a generic web application frontend.

## Use

Download the code:

```
git clone git@github.com:catamphetamine/webapp-frontend.git
git clone git@github.com:catamphetamine/webapp-backend.git
```

<details>
<summary>Populate the database (MySQL):</summary>

####

```sql
-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.20-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for webapp-dev
DROP DATABASE IF EXISTS `webapp-dev`;
CREATE DATABASE IF NOT EXISTS `webapp-dev` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `webapp-dev`;

-- Dumping structure for table webapp-dev.accounts
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idAlias` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `data` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nameId` (`idAlias`),
  KEY `userId` (`userId`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table webapp-dev.accounts: ~1 rows (approximately)
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`id`, `idAlias`, `name`, `data`, `createdAt`, `updatedAt`, `userId`) VALUES
	(1, 'alice', 'Alice Green', '{\r\n				"description": "Modelling clay is any of a group of malleable substances used in building and sculpting. The material compositions and production processes vary considerably.",\r\n				"whereabouts": "Portland, OR",\r\n				"links": [{\r\n					"url": "https://facebook.com/alice",\r\n					"text": "facebook.com/alice"\r\n				}, {\r\n					"url": "https://google.com",\r\n					"text": "google.com"\r\n				}],\r\n"picture": {\r\n "type": "image/jpeg",\r\n"width": 400,\r\n"height": 400,\r\n"url": "https://i.etsystatic.com/iusa/ec422b/61700410/iusa_400x400.61700410_eiad.jpg"\r\n}\r\n\r\n			}', '2018-10-27 15:47:32', '2018-10-27 15:47:34', 1);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Dumping structure for table webapp-dev.posts
DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `attachments` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `accountId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table webapp-dev.posts: ~4 rows (approximately)
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` (`id`, `title`, `content`, `attachments`, `createdAt`, `updatedAt`, `accountId`) VALUES
	(1, NULL, '			[\r\n				{\r\n					"type": "heading",\r\n						"content": "Craft"\r\n				},\r\n				"A craft or trade is a pastime or a profession that requires particular skills and knowledge of skilled work.",\r\n				{\r\n					"type": "attachment",\r\n					"attachmentId": 5\r\n				},\r\n				{\r\n					"type": "quote",\r\n						"content": "Every child is an artist. The problem is how to remain an artist once we grow up.",\r\n						"source": "Pablo Picasso",\r\n						"url": "https://google.com"\r\n				},\r\n				{\r\n					"type": "list",\r\n						"items": [\r\n							"Coffee",\r\n							"Tea",\r\n							"Milk"\r\n						]\r\n				},\r\n				[\r\n					"In a ",\r\n					{\r\n						"type": "link",\r\n							"content": "historical",\r\n							"url": "https://google.com"\r\n					},\r\n					" sense, particularly the Middle Ages and earlier, the term is usually applied to people occupied in small-scale production of goods, or their maintenance, for example by tinkers."\r\n				],\r\n				{\r\n					"type": "attachment",\r\n					"attachmentId": 6\r\n				},\r\n				"The traditional term craftsman is nowadays often replaced by artisan and rarely by craftsperson (craftspeople).",\r\n				"Historically, the more specialized crafts with high value products tended to concentrate in urban centers and formed guilds. The skill required by their professions and the need to be permanently involved in the exchange of goods often demanded a generally higher level of education, and craftsmen were usually in a more privileged position than the peasantry in societal hierarchy. The households of craftsmen were not as self-sufficient as those of people engaged in agricultural work and therefore had to rely on the exchange of goods. Some crafts, especially in areas such as pottery, woodworking, and the various stages of textile production, could be practiced on a part-time basis by those also working in agriculture, and often formed part of village life."\r\n			]', '[\r\n\r\n{\r\n				"id": 4,\r\n				"type": "video",\r\n				"video": {\r\n					"provider": "YouTube",\r\n					"id": "P3DGwyl0mJQ",\r\n					"picture": {\r\n						"type": "image/jpeg",\r\n						"url": "https://img.youtube.com/vi/P3DGwyl0mJQ/maxresdefault.jpg",\r\n						"width": 1280,\r\n						"height": 720\r\n					}\r\n				}\r\n			}, \r\n\r\n{\r\n				"id": 11,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/jq1M-EQZblU/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 12,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/DMmi7_P8XKo/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 13,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/Jhd_r-mI1_M/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 21,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/jq1M-EQZblU/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 22,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/DMmi7_P8XKo/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 23,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/Jhd_r-mI1_M/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 31,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/jq1M-EQZblU/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 32,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/DMmi7_P8XKo/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 33,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/Jhd_r-mI1_M/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 5,\r\n				"type": "video",\r\n				"video": {\r\n					"provider": "YouTube",\r\n					"id": "FlSUQFTRfAw",\r\n					"picture": {\r\n						"type": "image/jpeg",\r\n						"url": "https://img.youtube.com/vi/FlSUQFTRfAw/maxresdefault.jpg",\r\n						"width": 1280,\r\n						"height": 720\r\n					}\r\n				}\r\n			}, {\r\n				"id": 6,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/fU8XLCOjRdw/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}]', '2017-09-26 15:56:10', '2018-10-27 15:56:11', 1),
	(2, NULL, '[\r\n				"Once an apprentice of a craft had finished his apprenticeship, he would become a journeyman searching for a place to set up his own shop and make a living. After he set up his own shop, he could then call himself a master of his craft.",\r\n				"This system of a stepwise approach to mastery of a craft, which includes the obtainment of a certain amount of education and the learning of skills, has survived in some countries of the world until today. But crafts have undergone deep structural changes during and since the end of the Industrial Revolution. The mass production of goods by large-scale industry has limited crafts to market segments in which industry\\"s modes of functioning or its mass-produced goods would not or cannot satisfy the preferences of potential buyers. Moreover, as an outcome of these changes, craftspeople today increasingly make use of semi-finished components or materials and adapt these to their customers\\" requirements or demands and, if necessary, to the environments of their customers. Thus, they participate in a certain division of labour between industry and craft."\r\n			]', '[{\r\n				"id": 1,\r\n				"type": "picture",\r\n				"picture": {\r\n					"type": "image/jpeg",\r\n					"url": "https://img.youtube.com/vi/P3DGwyl0mJQ/maxresdefault.jpg",\r\n					"width": 1280,\r\n					"height": 720\r\n				}\r\n			}, {\r\n				"id": 2,\r\n				"type": "video",\r\n				"video": {\r\n					"title": "Dewhorn",\r\n					"description": "A young boy escapes to the woods to indulge his fantasies but finds himself consumed by them, longing to return home.<br />\\n<br />\\nBased on the song \\"Dewhorn\\" by Tispur.<br />\\n<br />\\nLittle Boy - Alasdair McLenna<br />\\nMother - Juliana McLenna<br />\\nSchool Teacher - Kyra Bernauer<br />\\nBuried Muse - Samwise Carlson<br />\\nForest Spirit - Easton Dufur<br />\\nExtras - Baron Wilson, Grayson Carter, Liam Sweeney, Desmond McLenna<br />\\n<br />\\nDirector + Writer: Brandon Kapelow<br />\\nProducers: Matthew Wordell, Jesse Hays, Brandon Kapelow<br />\\nEP: Jennifer Goodridge<br />\\nAssoc. Producers: Charlie Balch, Laurel Thomson, Loren Hill<br />\\n1st AD: Jesse Hays<br />\\n<br />\\nDP: Luke Orlando<br />\\n1st AC: Lila Streicher<br />\\nDrone Pilot: Matthew Wordell<br />\\nSteadicam: Brandon Kapelow<br />\\n<br />\\nProd. Coordinator: Izze Rump<br />\\nPAs: James Richardson, Parker Nettles, Aaron Rodriguez, Sara Greyfox, Louie Bash<br />\\n<br />\\nWatercolor Animation: Bobby Moser<br />\\n<br />\\nProduction Designer: Alyssa Pearson<br />\\nArt Director: Caitlin Goff<br />\\nCostume & Creature Design: Odette Mattha<br />\\nWardrobe Stylist: Bronwyn Leslie<br />\\nSet Decorator: Kyra Bernauer<br />\\n<br />\\nEditor: Brandon Kapelow<br />\\nSound Design: Jackie! Zhou<br />\\nSound Mixer: Tucker Grindstaff<br />\\n<br />\\nHarp - Matthew Tutsky<br />\\nViolin - Brynn Givans<br />\\nViola - Judah Claffey<br />\\nCello - Jake Saunders<br />\\n<br />\\nThe Mill, Chicago<br />\\nVFX Producer - Mike Pullan<br />\\nColor EP - Laurie Adrianopoli<br />\\nColor Producer - Dan Butler<br />\\nColorist - Mikey Pehanich<br />\\nCompositor - Jonny Freeman<br />\\nNuke Artist - Ruth Meridjen<br />\\nColor Assist - Lindsey Mazur<br />\\n<br />\\nDI - Cinelicious<br />\\nDI Producer - Estelle Mataranga<br />\\nFilm Processing & Scanning - Fotokem, Pro8mm<br />\\n<br />\\nSpecial Thanks - Ben McLenna, Spencer Creigh, Laurel Thomson, Mishka Kornai, Ariel Fisher, Drew Heskett, Fotokem, Judy Engle, Nico Aguilar, Kevin Calero, Pro8mm, Heidi Parker, Eric Gilbert, Cinelicious, Dan Carr, Nick Roney, Matt Carter, The Mill, Dan Thomas, Edwards Greenhouse, Luke Lucas, Sean Conaty, Duck Club, Kylie George MacEntee, Kauai Moliterno, Chef Amy, Alex Satterlee, Erin Sweeney, Erich Wilhelm Zander, Beyond Ideas, Thomas Wilson, Daniel Frantz, Eastside Camera, Kaelin Wilson, John McGrath, Brigette Nelson",\r\n					"width": 1920,\r\n					"height": 1080,\r\n					"duration": 399,\r\n					"provider": "Vimeo",\r\n					"id": "289902998",\r\n					"picture": {\r\n						"type": "image/jpeg",\r\n						"url": "https://i.vimeocdn.com/video/726258668_640.jpg",\r\n						"width": 640,\r\n						"height": 360\r\n					}\r\n				}\r\n			}, {\r\n				"id": 3,\r\n				"type": "video",\r\n				"video": {\r\n					"provider": "YouTube",\r\n					"id": "P3DGwyl0mJQ",\r\n					"picture": {\r\n						"type": "image/jpeg",\r\n						"url": "https://img.youtube.com/vi/P3DGwyl0mJQ/maxresdefault.jpg",\r\n						"width": 1280,\r\n						"height": 720\r\n					}\r\n				}\r\n			}]', '2018-06-21 15:57:27', '2018-10-27 15:57:34', 1),
	(3, NULL, NULL, '[\r\n\r\n\r\n			{\r\n				"id": 3,\r\n				"type": "video",\r\n				"video": {\r\n					"provider": "YouTube",\r\n					"id": "P3DGwyl0mJQ",\r\n					"picture": {\r\n						"type": "image/jpeg",\r\n						"url": "https://img.youtube.com/vi/P3DGwyl0mJQ/maxresdefault.jpg",\r\n						"width": 1280,\r\n						"height": 720\r\n						\r\n					}\r\n				}\r\n			}\r\n,\r\n			{\r\n				"id": 4,\r\n				"type": "video",\r\n				"video": {\r\n					"type": "video/mp4",\r\n					"url": "https://www.w3schools.com/html/mov_bbb.mp4",\r\n					"width": 320,\r\n					"height": 176,\r\n					"picture": {\r\n						"type": "image/png",\r\n						"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Pepsi_Cola_logo_1940.svg/320px-Pepsi_Cola_logo_1940.svg.png",\r\n						"width": 320,\r\n						"height": 176\r\n					}\r\n				}\r\n			}\r\n]', '2018-08-27 15:59:04', '2018-10-27 15:59:15', 1),
	(4, NULL, '"The residence was designed by Irish-born architect James Hoban[2] in the neoclassical style. Construction took place between 1792 and 1800 using Aquia Creek sandstone painted white. When Thomas Jefferson moved into the house in 1801, he (with architect Benjamin Henry Latrobe) added low colonnades on each wing that concealed stables and storage. In 1814, during the War of 1812, the mansion was set ablaze by the British Army in the Burning of Washington, destroying the interior and charring much of the exterior. Reconstruction began almost immediately, and President James Monroe moved into the partially reconstructed Executive Residence in October 1817. Exterior construction continued with the addition of the semi-circular South portico in 1824 and the North portico in 1829."', NULL, '2018-10-27 16:03:45', '2018-10-27 16:03:47', 1);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;

-- Dumping structure for table webapp-dev.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `phoneExt` varchar(255) DEFAULT NULL,
  `birthDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table webapp-dev.users: ~1 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `firstName`, `middleName`, `lastName`, `email`, `phone`, `phoneExt`, `birthDate`, `createdAt`, `updatedAt`) VALUES
	(1, 'Alice', NULL, 'Green', 'kuchumovn@gmail.com', NULL, NULL, NULL, '2018-10-27 15:47:17', '2018-10-27 15:47:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

```
</details>

####

Run the API:

```
cd webapp-backend
npm install
npm run dev
```

Run the application (in a separate terminal):

```
cd webapp-frontend
npm install
npm run dev
```

Go to [`http://localhost:3000`](http://localhost:3000)