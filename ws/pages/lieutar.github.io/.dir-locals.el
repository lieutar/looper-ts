((nil . ((eval . (progn
                   (dap-register-debug-template
                    "Bun Build Script Debug"
                    (list :type "node"
                          :request "launch"
                          :name "Bun Build Script Debug"
                          :program "bun"
                          ;;:args '("run" "scripts/build.ts" "--inspect")
                          :args '("run" "scripts/build.ts")
                          :cwd "${workspaceFolder}"
                          :bunFlags '()
                          :stopOnEntry t
                          ;;:console "integratedTerminal"
                          :console "internalConsole"
                          ))

                   ;; (dap-register-debug-template
                   ;;  "Bun Dev Script Debug"
                   ;;  (list :type "bun"
                   ;;        :request "launch"
                   ;;        :name "Bun Dev Script Debug"
                   ;;        :program "bun"
                   ;;        :args '("run" "src/dev.ts" "--inspect")
                   ;;        :cwd "${workspaceFolder}"
                   ;;        :bunFlags '()
                   ;;        :stopOnEntry t
                   ;;        :console "integratedTerminal"))

                   )))))
