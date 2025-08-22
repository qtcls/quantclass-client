!define DEFAULT_INSTALL_DIR "C:\Quantclass"
!define DIR_NAME "Quantclass"

!macro preInit
	SetRegView 64
	WriteRegExpandStr HKLM "Software\${PRODUCT_NAME}" InstallLocation "${DEFAULT_INSTALL_DIR}"
	WriteRegExpandStr HKCU "Software\${PRODUCT_NAME}" InstallLocation "${DEFAULT_INSTALL_DIR}"
	SetRegView 32
	WriteRegExpandStr HKLM "Software\${PRODUCT_NAME}" InstallLocation "${DEFAULT_INSTALL_DIR}"
	WriteRegExpandStr HKCU "Software\${PRODUCT_NAME}" InstallLocation "${DEFAULT_INSTALL_DIR}"
!macroend

Function .onVerifyInstDir
  StrLen $0 "\${DIR_NAME}"
  StrCpy $1 "$INSTDIR" "" -$0
  StrCmp $1 "\${DIR_NAME}" +2 0
  StrCpy $INSTDIR "$INSTDIR\${DIR_NAME}"
FunctionEnd

!macro customUnInstall
    SetRegView 64
    DeleteRegValue HKLM "Software\${PRODUCT_NAME}" "InstallLocation"
    DeleteRegValue HKCU "Software\${PRODUCT_NAME}" "InstallLocation"
    DeleteRegKey /ifempty HKLM "Software\${PRODUCT_NAME}"
    DeleteRegKey /ifempty HKCU "Software\${PRODUCT_NAME}"
    SetRegView 32
    DeleteRegValue HKLM "Software\${PRODUCT_NAME}" "InstallLocation"
    DeleteRegValue HKCU "Software\${PRODUCT_NAME}" "InstallLocation"
    DeleteRegKey /ifempty HKLM "Software\${PRODUCT_NAME}"
    DeleteRegKey /ifempty HKCU "Software\${PRODUCT_NAME}"
!macroend

!macro customRemoveFiles
 ${if} ${isUpdated}
    !insertmacro quitSuccess
 ${endIf}
!macroend
