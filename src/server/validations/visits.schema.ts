import { z } from 'zod';

export const getHeatmapParams = z.object({
	dateRange: z.enum(['last_week', 'last_two_weeks', 'last_month', 'last_quarter', 'last_year'])
});

export const getHeatmapResponse = z.object({
	country: z.string(),
	hour: z.number(),
	uniqueVisitors: z.number()
});

export type GetHeatmapParams = z.infer<typeof getHeatmapParams>;
export type GetHeatmapResponse = z.infer<typeof getHeatmapResponse>;
