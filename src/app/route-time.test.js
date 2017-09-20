/* global it, expect */
import { getRouteTime } from './route-time'


it('consolidates route attribute response into a keyed object', () => {
  const routeAttributesResp = [
{
	"admins": [{
		"state_text": "Rizal",
		"state_code": "RIZ",
		"country_text": "Philippines",
		"country_code": "PH"
	}, {
		"state_text": "None",
		"state_code": "",
		"country_text": "None",
		"country_code": ""
	}],
	"osm_changeset": 50115861,
	"shape": "aakvZipzxeFhCl_@vEnr@PvCjAdPn@nIbAdOhJz~AhBl_@lC`f@r@zKRdEjDhm@v@rPh@xLlBhW|OpoBDjAfCxa@L|IIrGO`G_@|JMdEYdZkC`|@aAhVgC`r@g@`Hm@hk@jA~h@LzKbDvb@pAvNlH~g@dIhk@fHbf@hBpReOz@m_@xBod@hCgk@fDwLzAoKxAox@dF{F\\}e@dFu}AtOwe@pG}D\\quAvNoYfDu{@vM{z@hMafDrf@qRrFwzAzUq_A~RksAtYoHlAiOxAiJxByzAb\\_e@|J{vAp[_g@zKqf@dPgEzAeq@lTukC`{@kFzAgKvD_`@hMcr@jU{DjAw}Ade@yu@fX_|A|i@aNtE}Q~GysBzu@{dA|^kIfDk~@xa@gDzAwSnIqp@fXot@rZanAzk@eu@p\\um@dYgMbGyg@~Scv@j`@gHfDmHtDew@l_@{`@`R{^rPmy@ja@eFfCsHvD}WhMo\\xLgFxBot@tZ_|D~nBwkCjtAyHfDcKhCiEkAkE?aGjAcDhBcDdFaAdDWxCsCrFmEbGeJ~Hgy@~g@sJeE",
	"edges": [{
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 25,
				"driveability": "both"
			}],
			"elapsed_time": 3,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 251658259320,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 1803148086136,
		"speed": 60,
		"length": 0.057,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 262,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 1,
		"density": 14,
		"way_id": 238967422,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 0,
		"max_downward_grade": 32768,
		"begin_heading": 262,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"begin_heading": 20,
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false
			}],
			"elapsed_time": 8,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 251658259320,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 1872739978104,
		"speed": 60,
		"length": 0.090,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 262,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 2,
		"density": 14,
		"way_id": 238967422,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 1,
		"max_downward_grade": 32768,
		"begin_heading": 262,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"type": "street_intersection",
			"admin_index": 0,
			"elapsed_time": 12
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 251658259320,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 2054403672952,
		"speed": 60,
		"length": 0.056,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 262,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 5,
		"density": 14,
		"way_id": 238967422,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 2,
		"max_downward_grade": 32768,
		"begin_heading": 262,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 256,
				"driveability": "forward"
			}],
			"elapsed_time": 13,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": true,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 251658259320,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "Malibay Bridge (South Bound)", "Epifanio de los Santos Avenue"],
		"speed": 60,
		"id": 1934580796280,
		"length": 0.028,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 262,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 6,
		"density": 14,
		"way_id": 111735142,
		"bridge": true,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 5,
		"max_downward_grade": 32768,
		"begin_heading": 262,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 23,
				"driveability": "both"
			}],
			"elapsed_time": 23,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 231559154552,
			"starts_segment": true
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 1934882786168,
		"speed": 60,
		"length": 0.166,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 263,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 7,
		"density": 14,
		"way_id": 111735141,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 6,
		"max_downward_grade": 32768,
		"begin_heading": 263,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"begin_heading": 6,
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false
			}],
			"elapsed_time": 32,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 231559154552,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 1755500792696,
		"speed": 60,
		"length": 0.146,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 263,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 10,
		"density": 14,
		"way_id": 351863414,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 7,
		"max_downward_grade": 32768,
		"begin_heading": 264,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 20,
				"driveability": "backward"
			}],
			"elapsed_time": 33,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 231559154552,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 2118358420344,
		"speed": 60,
		"length": 0.011,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 263,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 11,
		"density": 14,
		"way_id": 351863414,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 10,
		"max_downward_grade": 32768,
		"begin_heading": 263,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 3,
				"driveability": "both"
			}],
			"elapsed_time": 39,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 231559154552,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 1582594804600,
		"speed": 60,
		"length": 0.111,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 264,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 13,
		"density": 14,
		"way_id": 351863414,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 11,
		"max_downward_grade": 32768,
		"begin_heading": 263,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 356,
				"driveability": "both"
			}],
			"elapsed_time": 43,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 231559154552,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 2024137575288,
		"speed": 60,
		"length": 0.066,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 262,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 15,
		"density": 13,
		"way_id": 351863414,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 13,
		"max_downward_grade": 32768,
		"begin_heading": 264,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 355,
				"driveability": "forward"
			}],
			"elapsed_time": 55,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": true,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 231559154552,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 1716007226232,
		"speed": 60,
		"length": 0.196,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 261,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 16,
		"density": 13,
		"way_id": 351863414,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 15,
		"max_downward_grade": 32768,
		"begin_heading": 261,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 358,
				"driveability": "forward"
			}, {
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 234,
				"driveability": "backward"
			}],
			"elapsed_time": 59,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": true,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 876341119864,
			"starts_segment": true
		}],
		"names": ["1", "AH26", "EDSA", "Epifanio de los Santos Avenue"],
		"id": 1715906562936,
		"speed": 60,
		"length": 0.065,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 263,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 18,
		"density": 13,
		"way_id": 351863414,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 16,
		"max_downward_grade": 32768,
		"begin_heading": 263,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 7,
				"driveability": "backward"
			}],
			"elapsed_time": 77,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"names": ["1", "AH26", "EDSA"],
		"speed": 60,
		"id": 1553134013304,
		"length": 0.019,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 268,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 19,
		"density": 13,
		"way_id": 224220096,
		"vehicle_type": "car",
		"drive_on_right": true,
		"internal_intersection": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 18,
		"max_downward_grade": 32768,
		"begin_heading": 268,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 346,
				"driveability": "both"
			}],
			"elapsed_time": 81,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 258503363448,
			"starts_segment": true
		}],
		"names": ["1", "AH26", "EDSA"],
		"id": 1552899132280,
		"speed": 60,
		"length": 0.015,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 271,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 20,
		"density": 13,
		"way_id": 156782313,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 19,
		"max_downward_grade": 32768,
		"begin_heading": 271,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 103,
				"driveability": "both"
			}],
			"elapsed_time": 81,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": true,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 258503363448,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA"],
		"id": 1893979933560,
		"speed": 60,
		"length": 0.014,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 274,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 21,
		"density": 13,
		"way_id": 156782313,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 20,
		"max_downward_grade": 32768,
		"begin_heading": 274,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"begin_heading": 42,
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false
			}],
			"elapsed_time": 87,
			"admin_index": 0,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 197904059256,
			"starts_segment": true
		}],
		"names": ["1", "AH26", "EDSA"],
		"id": 2080475466616,
		"speed": 60,
		"length": 0.021,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 275,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 22,
		"density": 13,
		"way_id": 156782313,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 21,
		"max_downward_grade": 32768,
		"begin_heading": 275,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 358,
				"driveability": "both"
			}],
			"elapsed_time": 90,
			"admin_index": 1,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": false,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 197904059256,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA"],
		"id": 2048967854968,
		"speed": 60,
		"length": 0.058,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 272,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 24,
		"density": 13,
		"way_id": 156782313,
		"vehicle_type": "car",
		"drive_on_right": true,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 22,
		"max_downward_grade": 32768,
		"begin_heading": 273,
		"road_class": "trunk"
	}, {
		"end_node": {
			"time_zone": "PHT+08",
			"intersecting_edges": [{
				"to_edge_name_consistency": false,
				"from_edge_name_consistency": false,
				"begin_heading": 353,
				"driveability": "backward"
			}],
			"elapsed_time": 99,
			"admin_index": 1,
			"type": "street_intersection"
		},
		"traffic_segments": [{
			"ends_segment": true,
			"begin_percent": 0.000,
			"end_percent": 1.000,
			"segment_id": 197904059256,
			"starts_segment": false
		}],
		"names": ["1", "AH26", "EDSA"],
		"id": 1261747325816,
		"speed": 60,
		"length": 0.146,
		"mean_elevation": 32768,
		"weighted_grade": 0.000,
		"max_upward_grade": 32768,
		"end_heading": 275,
		"travel_mode": "drive",
		"speed_limit": 60,
		"bicycle_network": 0,
		"surface": "paved_smooth",
		"end_shape_index": 26,
		"density": 13,
		"way_id": 156782313,
		"vehicle_type": "car",
		"drive_on_right": false,
		"use": "road",
		"lane_count": 4,
		"traversability": "forward",
		"begin_shape_index": 24,
		"max_downward_grade": 32768,
		"begin_heading": 275,
		"road_class": "trunk"
	}]
  const routeTime = getRouteTime(routeAttributesResp)
/*
  expect(routeTime).toHaveProperty('0')
  expect(routeTime).toHaveProperty('1')
  expect(routeTime['0']).toHaveProperty('1000')
  expect(routeTime['0']).toHaveProperty('1001')
  expect(routeTime['1']).toHaveProperty('1000')
  expect(routeTime['0']['1000']['0']).toHaveProperty('speeds')
  expect(routeTime['0']['1000']['1']).toHaveProperty('speeds')*/
})
