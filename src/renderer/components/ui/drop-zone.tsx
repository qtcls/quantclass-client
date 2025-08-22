/**
 * quantclass-client
 * Copyright (c) 2025 量化小讲堂
 *
 * Licensed under the Business Source License 1.1 (BUSL-1.1).
 * Additional Use Grant: None
 * Change Date: 2028-08-22 | Change License: GPL-3.0-or-later
 * See the LICENSE file and https://mariadb.com/bsl11/
 */

import { cn } from "@renderer/lib/utils"
// Packages:
import React, { useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"
import truncate from "truncate"

import { useDebounceFn } from "etc-hooks"
// Typescript:
import {
	type DropzoneProps as _DropzoneProps,
	type DropzoneState as _DropzoneState,
} from "react-dropzone"

export interface DropzoneState extends _DropzoneState {}

export interface DropzoneProps extends Omit<_DropzoneProps, "children"> {
	containerClassName?: string
	dropZoneClassName?: string
	children?: (dropzone: DropzoneState) => React.ReactNode
	showFilesList?: boolean
	showErrorMessage?: boolean
	maxFiles?: number // -- 新增:最大文件数量
	acceptedFileTypes?: string[] // -- 新增:接受的文件类型数组
	onUploadSuccess?: (files: File[]) => void
	onFilesUploaded?: (files: string[]) => void
	onParse?: (files: string[]) => Promise<void>
}

const Upload = ({
	className,
}: {
	className?: string
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={cn("lucide lucide-upload", className)}
	>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="17 8 12 3 7 8" />
		<line x1="12" x2="12" y1="3" y2="15" />
	</svg>
)

const PDF = ({
	className,
}: {
	className?: string
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={cn("lucide lucide-file-text", className)}
	>
		<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
		<path d="M14 2v4a2 2 0 0 0 2 2h4" />
		<path d="M10 9H8" />
		<path d="M16 13H8" />
		<path d="M16 17H8" />
	</svg>
)

const Image = ({
	className,
}: {
	className?: string
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={cn("lucide lucide-image", className)}
	>
		<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
		<circle cx="9" cy="9" r="2" />
		<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
	</svg>
)

const Trash = ({
	className,
}: {
	className?: string
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={cn("lucide lucide-trash", className)}
	>
		<path d="M3 6h18" />
		<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
		<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
	</svg>
)

// 添加 ZIP 图标组件
const ZIP = ({
	className,
}: {
	className?: string
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={cn("lucide lucide-file-archive", className)}
	>
		<path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h8.5L20 7.5V20c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6H4" />
		<polyline points="14 2 14 8 20 8" />
		<path d="M10 20v-4a2 2 0 1 1 4 0v4" />
		<path d="M6 18h2" />
		<path d="M6 14h2" />
		<path d="M6 10h2" />
		<path d="M10 2v4" />
		<path d="M10 10v4" />
		<path d="M10 18v2" />
	</svg>
)

const Python = ({
	className,
}: {
	className?: string
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={cn("lucide lucide-file-code", className)}
	>
		<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
		<polyline points="14 2 14 8 20 8" />
		<path d="m10 13-2 2 2 2" />
		<path d="m14 17 2-2-2-2" />
	</svg>
)

const errorMessages: { [key: string]: string } = {
	"file-invalid-type": "文件类型无效",
	"file-too-large": "文件过大",
	"file-too-small": "文件过小",
	"too-many-files": "文件数量过多",
	"file-invalid-name": "文件名无效",
}

// 新增辅助函数
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes"
	const k = 1024
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const { selectFile } = window.electronAPI

const Dropzone = ({
	containerClassName,
	dropZoneClassName,
	children,
	showFilesList = true,
	showErrorMessage = true,
	maxFiles = Infinity, // -- 新增:默认无限制
	acceptedFileTypes, // -- 新增
	onUploadSuccess,
	onFilesUploaded,
	onParse,
	...props
}: DropzoneProps) => {
	// Constants:
	const dropzone = useDropzone({
		...props,
		maxFiles, // -- 新增:设置最大文件数
		noClick: true,
		accept: acceptedFileTypes?.reduce(
			(acc, type) => ({ ...acc, [type]: [] }),
			{},
		), // -- 新增:设置接受的文件类型
		onDrop(acceptedFiles, fileRejections, event) {
			if (props.onDrop) {
				props.onDrop(acceptedFiles, fileRejections, event)
			} else {
				const newFiles = [...filesUploaded, ...acceptedFiles].slice(0, maxFiles)
				setFilesUploaded(newFiles)

				const errorMessage = getErrorMessage(
					fileRejections,
					acceptedFiles.length,
				)
				setErrorMessage(errorMessage)

				if (!errorMessage) {
					if (onUploadSuccess) {
						onUploadSuccess(newFiles)
					}
					if (onFilesUploaded) {
						onFilesUploaded(newFiles.map((file) => file.path))
					}
				}
			}
		},
	})

	const [filesUploaded, setFilesUploaded] = useState<File[]>([])
	const [errorMessage, setErrorMessage] = useState<string>()

	const deleteUploadedFile = (index: number) => {
		setFilesUploaded((_uploadedFiles) => [
			..._uploadedFiles.slice(0, index),
			..._uploadedFiles.slice(index + 1),
		])
	}

	const getFileIcon = (file: File) => {
		if (file.type === "application/pdf") {
			return <PDF className="text-rose-700 w-6 h-6" />
		}
		if (file.type === "application/zip" || file.name.endsWith(".zip")) {
			return <ZIP className="text-amber-600 w-6 h-6" />
		}
		if (file.name.endsWith(".py")) {
			return <Python className="text-blue-500 w-6 h-6" />
		}
		if (file.type.startsWith("image/")) {
			return <Image className="text-rose-700 w-6 h-6" />
		}
		// 默认图标，可以根据需要调整
		return <Upload className="text-gray-500 w-6 h-6" />
	}

	const getErrorMessage = (
		fileRejections: FileRejection[],
		acceptedFilesCount: number,
	) => {
		if (fileRejections.length > 0) {
			const { file, errors } = fileRejections[0]
			const errorCode = errors[0].code
			let message = `无法上传 ${file.name}`

			if (fileRejections.length > 1) {
				message += `，以及其他 ${fileRejections.length - 1} 个文件`
			}

			message += `。${errorMessages[errorCode] || "上传了不支持格式的文件"}`
			return message
		}

		if (acceptedFilesCount + filesUploaded.length > maxFiles) {
			return `最多只能上传 ${maxFiles} 个文件。`
		}

		return ""
	}

	const handleFolderSelect = useDebounceFn(
		async () => {
			try {
				const res = await selectFile({
					filters: [{ name: "python", extensions: ["py"] }],
				})
				res && onParse?.(res as string[])
			} finally {
			}
		},
		{ wait: 100 },
	)

	return (
		<div className={cn("flex flex-col gap-2", containerClassName)}>
			<div
				{...dropzone.getRootProps()}
				onClick={() => {
					handleFolderSelect.run()
				}}
				className={cn(
					"flex justify-center items-center w-full h-32 border-dashed border-2 border-gray-200 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all select-none cursor-pointer",
					dropZoneClassName,
				)}
			>
				<input {...dropzone.getInputProps()} />
				{children ? (
					children(dropzone)
				) : dropzone.isDragAccept ? (
					<div className="text-sm font-medium">将文件拖放到此处！</div>
				) : (
					<div className="flex items-center flex-col gap-1.5">
						<div className="flex items-center flex-row gap-0.5 text-sm font-medium">
							<Upload className="mr-2 h-4 w-4" /> 上传文件
						</div>
						{props.maxSize && (
							<div className="text-xs text-gray-400 font-medium">
								最大文件大小: {(props.maxSize / (1024 * 1024)).toFixed(2)} MB
							</div>
						)}
						{maxFiles < Infinity && (
							<div className="text-xs text-gray-400 font-medium">
								最多上传 {maxFiles} 个文件
							</div>
						)}
						{acceptedFileTypes && (
							<div className="text-xs text-gray-400 font-medium">
								支持的文件类型: {acceptedFileTypes.join(", ")}
							</div>
						)}
					</div>
				)}
			</div>
			{errorMessage && (
				<span className="text-xs text-red-600 mt-3">{errorMessage}</span>
			)}
			{showFilesList && filesUploaded.length > 0 && (
				<div
					className={`flex flex-col gap-2 w-full ${filesUploaded.length > 2 ? "h-48" : "h-fit"} mt-2 ${filesUploaded.length > 0 ? "pb-2" : ""}`}
				>
					<div className="w-full">
						{filesUploaded.map((fileUploaded, index) => (
							<div
								key={index}
								className="flex justify-between items-center flex-row w-full h-16 mt-2 px-4 border-solid border-2 border-gray-200 rounded-lg shadow-sm"
							>
								<div className="flex items-center flex-row gap-4 h-full">
									{getFileIcon(fileUploaded)}
									<div className="flex flex-col gap-0">
										<div className="text-[0.85rem] font-medium leading-snug">
											{truncate(
												fileUploaded.name.split(".").slice(0, -1).join("."),
												30,
											)}
										</div>
										<div className="text-[0.7rem] text-gray-500 leading-tight">
											.{fileUploaded.name.split(".").pop()} •{" "}
											{formatFileSize(fileUploaded.size)}
										</div>
									</div>
								</div>
								<div
									className="p-2 rounded-full border-solid border-2 border-gray-100 shadow-sm hover:bg-accent transition-all select-none cursor-pointer"
									onClick={() => deleteUploadedFile(index)}
								>
									<Trash className="w-4 h-4" />
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

// Exports:
export default Dropzone
