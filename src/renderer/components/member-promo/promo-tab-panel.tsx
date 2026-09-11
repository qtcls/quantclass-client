/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { FEN_CLASS_URL_BY_YEAR } from "@/renderer/components/member-promo/constants"
import {
	memberPromoBodyTextClassName,
	memberPromoCarouselFrameClassName,
	memberPromoCarouselPlaceholderClassName,
	memberPromoFooterButtonClassName,
	memberPromoMutedTextClassName,
	memberPromoTitleClassName,
} from "@/renderer/components/member-promo/theme"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/renderer/components/ui/carousel"
import { cn } from "@/renderer/lib/utils"
import type { ReactNode } from "react"

interface MemberPromoTabPanelProps {
	title: string
	images?: string[]
	children: ReactNode
}

function PromoImageCarousel({ images }: { images: string[] }) {
	if (images.length === 0) {
		return (
			<div className={memberPromoCarouselPlaceholderClassName}>图片待补充</div>
		)
	}

	const hasMultiple = images.length > 1

	return (
		<div className={memberPromoCarouselFrameClassName}>
			<Carousel opts={{ loop: hasMultiple }} className="w-full px-10">
				<CarouselContent className="-ml-0">
					{images.map((src, index) => (
						<CarouselItem
							key={`${src}-${index}`}
							className="flex pl-0 items-center justify-center"
						>
							<img
								src={src}
								alt=""
								className="mx-auto max-h-[min(48vh,420px)] max-w-full rounded-lg object-contain"
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				{hasMultiple && (
					<>
						<CarouselPrevious className="-left-1 top-1/2 h-8 w-8 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-background/90" />
						<CarouselNext className="-right-1 top-1/2 h-8 w-8 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-background/90" />
					</>
				)}
			</Carousel>
		</div>
	)
}

export function MemberPromoFenClassButton({
	year,
	label,
}: {
	year: keyof typeof FEN_CLASS_URL_BY_YEAR
	label: string
}) {
	const { openUrl } = window.electronAPI

	return (
		<div className="mt-5 flex justify-center pb-1">
			<button
				type="button"
				className={memberPromoFooterButtonClassName}
				onClick={() => openUrl(FEN_CLASS_URL_BY_YEAR[year])}
			>
				{label}
			</button>
		</div>
	)
}

export function MemberPromoTabPanel({
	title,
	images = [],
	children,
}: MemberPromoTabPanelProps) {
	return (
		<div
			className={cn(
				"h-full min-h-0 overflow-y-auto pr-1",
				memberPromoBodyTextClassName,
			)}
		>
			<h2
				className={cn(
					"text-center text-lg font-bold tracking-wide",
					memberPromoTitleClassName,
				)}
			>
				{title}
			</h2>

			<div className="mt-3">
				<PromoImageCarousel images={images} />
			</div>

			<div className="mt-4 text-sm leading-relaxed">{children}</div>
		</div>
	)
}

export function MemberPromoPlaceholderBody() {
	return (
		<p
			className={cn("py-8 text-center text-sm", memberPromoMutedTextClassName)}
		>
			内容即将补充
		</p>
	)
}
