import { getHeatmapData } from '$server/lib/elasticsearch';
import type { GetHeatmapParams } from '$server/validations/visits.schema';

export class VisitsService {
	// async getHeatmap(param: GetHeatmapParams): Promise<GetHeatmapResponse> {
	async getHeatmap(param: GetHeatmapParams) {
		const dateRange = this.getRelativeDateRangeFromEnum(param.dateRange);

		// 1. Query Elasticsearch
		const data = await getHeatmapData(dateRange.start, dateRange.end);

		// 2. Format the data into a proper heatmap data structure.
		const heatmapData: { country: string; hour: number; count: number }[] = [];

		data.aggregations?.countries.buckets.forEach((country) => {
			country.hours.buckets.forEach((hour) => {
				heatmapData.push({
					country: country.key,
					/** Increment by 1 because the `hour_of_day` field is 0-based. */
					hour: hour.key + 1,
					count: hour.doc_count
				});
			});
		});

		return heatmapData;
	}

	getRelativeDateRangeFromEnum(dateRange: GetHeatmapParams['dateRange']) {
		const now = new Date();

		switch (dateRange) {
			case 'last_two_weeks':
				return {
					start: new Date(now.setDate(now.getDate() - 14)).toISOString(),
					end: new Date().toISOString()
				};
			case 'last_month':
				return {
					start: new Date(now.setMonth(now.getMonth() - 1)).toISOString(),
					end: new Date().toISOString()
				};
			case 'last_quarter':
				return {
					start: new Date(now.setMonth(now.getMonth() - 3)).toISOString(),
					end: new Date().toISOString()
				};
			case 'last_year':
				return {
					start: new Date(now.setMonth(now.getMonth() - 12)).toISOString(),
					end: new Date().toISOString()
				};
			default:
			case 'last_week':
				return {
					start: new Date(now.setDate(now.getDate() - 7)).toISOString(),
					end: new Date().toISOString()
				};
		}
	}
}
