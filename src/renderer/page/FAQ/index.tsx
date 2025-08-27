/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { ConfigEditor } from "@/renderer/components/ConfigEditor"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/renderer/components/ui/accordion"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import { H2 } from "@/renderer/components/ui/typography"
import { FAQList } from "@/renderer/page/FAQ/constant"

export default function FAQ() {
	return (
		<ConfigEditor />

		// <ScrollArea className="h-full">
		//     <div className="h-full flex-1 flex-col space-y-8 md:flex">
		//         <div className="flex items-center justify-between space-y-2">
		//             <div>
		//                 <H2>常见问题解答</H2>
		//                 <p className="text-muted-foreground">
		//                     该页面收集了一些常见问题，并提供了解答。
		//                 </p>
		//             </div>
		//         </div>

		//         <Accordion type="single" collapsible>
		//             {FAQList.map((item) => (
		//                 <AccordionItem value={item.trigger} key={item.trigger}>
		//                     <AccordionTrigger>{item.trigger}</AccordionTrigger>
		//                     <AccordionContent>{item.content}</AccordionContent>
		//                 </AccordionItem>
		//             ))}
		//         </Accordion>
		//     </div>
		// </ScrollArea>
	)
}
