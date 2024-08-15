import { VisitsService } from '$server/services/visits.service';
import { getHeatmapParams } from '$server/validations/visits.schema';
import { createTRPCRouter, publicProcedure } from '../trpcContext';

export const visitsRouter = createTRPCRouter({
	getHeatmap: publicProcedure.input(getHeatmapParams).query(({ input }) => {
		return new VisitsService().getHeatmap(input);
	})
});
