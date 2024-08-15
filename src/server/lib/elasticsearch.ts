import { env } from '$env/dynamic/private';
import { Client } from '@elastic/elasticsearch';

export const elasticClient = new Client({
	cloud: { id: env.ELASTIC_SEARCH_CLOUD_ID },
	auth: { apiKey: env.ELASTIC_SEARCH_API_KEY }
});

export async function getHeatmapData(startDate: string, endDate: string) {
	/** The `aggregations: T` of the search result. */
	type GetHeatMapDataAggregationResult = {
		countries: {
			doc_count_error_upperbound: number;
			sum_other_doc_count: number;
			buckets: {
				key: string;
				doc_count: string;
				hours: {
					buckets: { key: number; doc_count: number; unique: { value: number } }[];
				};
			}[];
		};
	};

	return await elasticClient.search<unknown, GetHeatMapDataAggregationResult>({
		index: env.ELASTIC_SEARCH_INDEX,
		query: {
			bool: {
				filter: [
					{
						range: {
							timestamp: {
								gte: startDate,
								lte: endDate,
								format: 'strict_date_optional_time'
							}
						}
					}
				]
			}
		},
		aggs: {
			countries: {
				terms: {
					field: 'geo.dest'
					// size: 1
				},
				aggs: {
					hours: {
						histogram: {
							field: 'hour_of_day',
							interval: 1
						},
						aggs: {
							unique: {
								cardinality: {
									field: 'clientip'
								}
							}
						}
					}
				}
			}
		},
		/**
		 * Calculate the 'hour_of_day' field using the 'timestamp' field. Because the `hour_of_day` seems to always return `[]` without this.
		 *
		 * Reference: Can get this from the Kibana Dashboard network tab of the request params.
		 * https://bilby-terminal-test.kb.us-central1.gcp.cloud.es.io:9243/internal/bsearch?compress=true
		 */
		runtime_mappings: {
			hour_of_day: {
				type: 'long',
				script: {
					source: "emit(doc['timestamp'].value.getHour());"
				}
			}
		},

		size: 0
	});
}
